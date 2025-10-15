from flask import Flask, request, jsonify, render_template, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
from pathlib import Path
import gurobipy as gp
from gurobipy import GRB
import time
import json
from datetime import datetime

# Load environment variables from .env (if present)
load_dotenv()

app = Flask(__name__)

# Compute a deterministic DB path pointing to the project's instance/scheduler.db
# app.py lives in venv/shift_scheduler_app; go up to the workspace root then into instance/
BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = BASE_DIR / 'instance' / 'scheduler.db'
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-this-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_PATH.as_posix()}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='manager')  # 'manager' or 'employee'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    schedules = db.relationship('SavedSchedule', backref='user', lazy=True, cascade='all, delete-orphan')
    
    # For employees - link to their employee record (specify foreign_keys to avoid ambiguity)
    employee_profile = db.relationship('Employee', foreign_keys='Employee.user_id', backref='user_account', uselist=False, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Nullable for manual entries
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Who created this employee
    name = db.Column(db.String(100), nullable=False)
    is_full_time = db.Column(db.Boolean, default=False)
    min_hours = db.Column(db.Integer, default=0)
    max_hours = db.Column(db.Integer, default=40)
    wage = db.Column(db.Float, default=0.0)
    can_be_responsible = db.Column(db.Boolean, default=False)
    availability = db.Column(db.Text, nullable=True)  # JSON string of availability
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Manager relationship
    manager = db.relationship('User', foreign_keys=[manager_id], backref='managed_employees')

class SavedSchedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    data = db.Column(db.Text, nullable=False)  # JSON string of schedule data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        form_type = request.form.get('form_type')
        username = request.form.get('username')
        password = request.form.get('password')

        if form_type == 'login':
            user = User.query.filter_by(username=username).first()
            if user and user.check_password(password):
                session['user_id'] = user.id
                session['username'] = user.username
                session['role'] = user.role
                
                # Redirect based on role
                if user.role == 'manager':
                    return redirect(url_for('manager_dashboard'))
                else:  # employee
                    return redirect(url_for('employee_dashboard'))
            else:
                return render_template('login.html', error='Invalid username or password')

        elif form_type == 'signup':
            email = request.form.get('email')
            password_confirm = request.form.get('password_confirm')

            if password != password_confirm:
                return render_template('login.html', error='Passwords do not match')

            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                return render_template('login.html', error='Username already exists')

            if email:
                existing_email = User.query.filter_by(email=email).first()
                if existing_email:
                    return render_template('login.html', error='Email already registered')

            # New users are managers by default
            new_user = User(username=username, email=email, role='manager')
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()

            session['user_id'] = new_user.id
            session['username'] = new_user.username
            session['role'] = new_user.role
            return redirect(url_for('manager_dashboard'))

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('landing'))

@app.route('/manager_dashboard')
def manager_dashboard():
    if 'user_id' not in session or session.get('role') != 'manager':
        return redirect(url_for('login'))
    return render_template('manager_dashboard.html')

@app.route('/employee_dashboard')
def employee_dashboard():
    if 'user_id' not in session or session.get('role') != 'employee':
        return redirect(url_for('login'))
    
    # Get employee profile
    user = User.query.get(session['user_id'])
    employee = user.employee_profile
    
    if not employee:
        return redirect(url_for('login'))
    
    return render_template('employee_dashboard.html', employee=employee)

@app.route('/scheduler')
def scheduler():
    if 'user_id' not in session:
        return render_template('index.html')
    
    # Check role and redirect accordingly
    if session.get('role') == 'manager':
        return render_template('index.html')
    else:
        return redirect(url_for('employee_dashboard'))

# Employee Management Routes
@app.route('/api/employees', methods=['GET'])
def get_employees():
    if 'user_id' not in session or session.get('role') != 'manager':
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    
    employees = Employee.query.filter_by(manager_id=session['user_id']).all()
    employees_list = []
    for emp in employees:
        employees_list.append({
            'id': emp.id,
            'name': emp.name,
            'is_full_time': emp.is_full_time,
            'min_hours': emp.min_hours,
            'max_hours': emp.max_hours,
            'wage': emp.wage,
            'can_be_responsible': emp.can_be_responsible,
            'availability': json.loads(emp.availability) if emp.availability else {},
            'has_account': emp.user_id is not None,
            'username': emp.user_account.username if emp.user_account else None
        })
    
    return jsonify({'status': 'success', 'employees': employees_list})

@app.route('/api/employees', methods=['POST'])
def create_employee():
    if 'user_id' not in session or session.get('role') != 'manager':
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    
    data = request.json
    
    # Check if creating with account
    user_id = None
    if data.get('create_account'):
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'status': 'error', 'message': 'Username and password required for account creation'}), 400
        
        # Check if username exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'status': 'error', 'message': 'Username already exists'}), 400
        
        # Create employee user account
        new_user = User(username=username, role='employee')
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.flush()  # Get the user ID
        user_id = new_user.id
    
    # Create employee record
    new_employee = Employee(
        user_id=user_id,
        manager_id=session['user_id'],
        name=data.get('name'),
        is_full_time=data.get('is_full_time', False),
        min_hours=data.get('min_hours', 0),
        max_hours=data.get('max_hours', 40),
        wage=data.get('wage', 0.0),
        can_be_responsible=data.get('can_be_responsible', False),
        availability=json.dumps(data.get('availability', {}))
    )
    
    db.session.add(new_employee)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'message': 'Employee created successfully',
        'employee_id': new_employee.id
    })

@app.route('/api/employees/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({'status': 'error', 'message': 'Employee not found'}), 404
    
    # Check authorization
    if session.get('role') == 'manager':
        # Manager can only update their own employees
        if employee.manager_id != session['user_id']:
            return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    elif session.get('role') == 'employee':
        # Employee can only update their own profile
        if employee.user_id != session['user_id']:
            return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    else:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    
    data = request.json
    
    # Update fields
    if 'name' in data:
        employee.name = data['name']
    if 'is_full_time' in data:
        employee.is_full_time = data['is_full_time']
    if 'min_hours' in data:
        employee.min_hours = data['min_hours']
    if 'max_hours' in data:
        employee.max_hours = data['max_hours']
    if 'wage' in data:
        employee.wage = data['wage']
    if 'can_be_responsible' in data:
        employee.can_be_responsible = data['can_be_responsible']
    if 'availability' in data:
        employee.availability = json.dumps(data['availability'])
    
    db.session.commit()
    
    return jsonify({'status': 'success', 'message': 'Employee updated successfully'})

@app.route('/api/employees/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    if 'user_id' not in session or session.get('role') != 'manager':
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({'status': 'error', 'message': 'Employee not found'}), 404
    
    if employee.manager_id != session['user_id']:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    
    # If employee has a user account, delete it too
    if employee.user_id:
        user = User.query.get(employee.user_id)
        if user:
            db.session.delete(user)
    
    db.session.delete(employee)
    db.session.commit()
    
    return jsonify({'status': 'success', 'message': 'Employee deleted successfully'})

@app.route('/api/my_profile', methods=['GET'])
def get_my_profile():
    if 'user_id' not in session or session.get('role') != 'employee':
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
    
    user = User.query.get(session['user_id'])
    employee = user.employee_profile
    
    if not employee:
        return jsonify({'status': 'error', 'message': 'Employee profile not found'}), 404
    
    return jsonify({
        'status': 'success',
        'employee': {
            'id': employee.id,
            'name': employee.name,
            'is_full_time': employee.is_full_time,
            'min_hours': employee.min_hours,
            'max_hours': employee.max_hours,
            'wage': employee.wage,
            'can_be_responsible': employee.can_be_responsible,
            'availability': json.loads(employee.availability) if employee.availability else {}
        }
    })

@app.route('/save_schedule', methods=['POST'])
def save_schedule():
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'You must be logged in to save schedules'}), 401

    data = request.json
    schedule_name = data.get('name', 'Untitled Schedule')
    schedule_data = json.dumps(data.get('schedule_data', {}))

    new_schedule = SavedSchedule(
        user_id=session['user_id'],
        name=schedule_name,
        data=schedule_data
    )
    db.session.add(new_schedule)
    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': 'Schedule saved successfully',
        'schedule_id': new_schedule.id
    })

@app.route('/get_schedules', methods=['GET'])
def get_schedules():
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'You must be logged in'}), 401

    user_schedules = SavedSchedule.query.filter_by(user_id=session['user_id']).order_by(SavedSchedule.updated_at.desc()).all()
    schedules_list = []
    for schedule in user_schedules:
        schedules_list.append({
            'id': schedule.id,
            'name': schedule.name,
            'created_at': schedule.created_at.strftime('%Y-%m-%d %H:%M'),
            'updated_at': schedule.updated_at.strftime('%Y-%m-%d %H:%M')
        })

    return jsonify({'status': 'success', 'schedules': schedules_list})

@app.route('/load_schedule/<int:schedule_id>', methods=['GET'])
def load_schedule(schedule_id):
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'You must be logged in'}), 401

    schedule = SavedSchedule.query.filter_by(id=schedule_id, user_id=session['user_id']).first()
    if not schedule:
        return jsonify({'status': 'error', 'message': 'Schedule not found'}), 404

    return jsonify({
        'status': 'success',
        'schedule': {
            'id': schedule.id,
            'name': schedule.name,
            'data': json.loads(schedule.data),
            'created_at': schedule.created_at.strftime('%Y-%m-%d %H:%M'),
            'updated_at': schedule.updated_at.strftime('%Y-%m-%d %H:%M')
        }
    })

@app.route('/delete_schedule/<int:schedule_id>', methods=['DELETE'])
def delete_schedule(schedule_id):
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'You must be logged in'}), 401

    schedule = SavedSchedule.query.filter_by(id=schedule_id, user_id=session['user_id']).first()
    if not schedule:
        return jsonify({'status': 'error', 'message': 'Schedule not found'}), 404

    db.session.delete(schedule)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Schedule deleted successfully'})

@app.route('/solve_schedule', methods=['POST'])
def solve_schedule():
    data = request.json

    # --- Extract data from frontend ---
    days = data['days']
    shifts_data = data['shifts'] # List of {name: 'Morning', hours: 4}
    num_shifts = len(shifts_data)

    shift_names = [s['name'] for s in shifts_data]
    shift_hours = {s['name']: s['hours'] for s in shifts_data}

    min_employees_per_shift_input = data['min_employees_per_shift']
    max_employees_per_shift_input = data['max_employees_per_shift']
    responsible_required_overall = data['responsible_required_overall'] # True/False
    full_time_hours_per_week = data['full_time_hours_per_week'] if data['full_time_hours_per_week'] else None

    employees_data = data['employees'] # List of employee objects

    # Process employee data
    employees = [emp['name'] for emp in employees_data]
    availability = {}
    min_hours = {}
    max_hours = {}
    wage = {}
    is_responsible = {}

    for emp in employees_data:
        e_name = emp['name']
        min_hours[e_name] = emp['min_hours']
        max_hours[e_name] = emp['max_hours']
        wage[e_name] = emp['wage']
        is_responsible[e_name] = 1 if emp['can_be_responsible'] else 0

        for d in days:
            for s_name in shift_names:
                # Assuming frontend sends availability as 'Employee1_Mon_Morning': True/False
                key = f"{e_name}_{d}_{s_name}"
                availability[(e_name, d, s_name)] = 1 if emp['availability'].get(key, False) else 0

    # Process min/max employees per shift
    min_employees = {}
    max_employees = {} # New variable
    for d in days:
        for s_name in shift_names:
            min_employees[(d, s_name)] = min_employees_per_shift_input.get(f'{d}_{s_name}', 0)
            max_employees[(d, s_name)] = max_employees_per_shift_input.get(f'{d}_{s_name}', 0)


    # === Gurobi Model ===
    model = gp.Model("ShiftScheduling")
    model.setParam('OutputFlag', 0) # Suppress Gurobi output in console

    # Decision variables
    x = model.addVars(employees, days, shift_names, vtype=GRB.BINARY, name="x")

    # Objective: minimize cost
    # If full_time_hours_per_week is set, wage is only considered for non-full-time hours,
    # or if we assume full-time workers have 0 wage cost in the model
    model.setObjective(
        gp.quicksum(wage[e] * shift_hours[s] * x[e, d, s]
                    for e in employees for d in days for s in shift_names),
        GRB.MINIMIZE
    )

    # 1. Availability
    for e in employees:
        for d in days:
            for s_name in shift_names:
                if availability[e, d, s_name] == 0:
                    model.addConstr(x[e, d, s_name] == 0, name=f"availability_{e}_{d}_{s_name}")

    # Constraint 2: Max 2 shifts per day (REMOVED as per request)

    # 3. Min and Max weekly hours
    for e in employees:
        total_hours = gp.quicksum(x[e, d, s_name] * shift_hours[s_name] for d in days for s_name in shift_names)

        # Only add min/max hours constraint if they are not 'unlimited' (represented by None or 0)
        if min_hours[e] is not None and min_hours[e] > 0:
            model.addConstr(total_hours >= min_hours[e], name=f"min_hours_{e}")
        if max_hours[e] is not None and max_hours[e] > 0:
            model.addConstr(total_hours <= max_hours[e], name=f"max_hours_{e}")

    # 4. Minimum number of employees per shift (if relevant)
    if any(min_employees[(d, s)] > 0 for d in days for s in shift_names): # Check if any min_employees is > 0
        for d in days:
            for s_name in shift_names:
                if min_employees[(d, s_name)] > 0:
                    model.addConstr(gp.quicksum(x[e, d, s_name] for e in employees) >= min_employees[(d, s_name)],
                                    name=f"min_emp_shift_{d}_{s_name}")

    # 6. Maximum number of employees per shift (NEW CONSTRAINT)
    if any(max_employees[(d, s)] > 0 for d in days for s in shift_names): # Check if any max_employees is > 0
        for d in days:
            for s_name in shift_names:
                if max_employees[(d, s_name)] > 0:
                    model.addConstr(gp.quicksum(x[e, d, s_name] for e in employees) <= max_employees[(d, s_name)],
                                    name=f"max_emp_shift_{d}_{s_name}")

    # 5. Responsible person assigned per shift (if required)
    if responsible_required_overall:
        for d in days:
            for s_name in shift_names:
                # Only require a responsible person if there are employees scheduled for that shift
                # This formulation ensures at least one responsible if anyone is working.
                # A stronger constraint would be to just require it if responsible_required_overall is true,
                # which is what the user asked for.
                model.addConstr(
                    gp.quicksum(is_responsible[e] * x[e, d, s_name] for e in employees) >= 1, # Must be >= 1 if required
                    name=f"responsible_req_{d}_{s_name}"
                )


    # Simulate a delay for processing to show user the "solving" message
    time.sleep(1)

    # === Solve ===
    try:
        model.optimize()
    except gp.GurobiError as e:
        return jsonify({'status': 'error', 'message': f'Gurobi Error: {e.Message}'}), 500


    # === Output ===
    if model.Status == GRB.OPTIMAL:
        schedule = {}
        for d in days:
            schedule[d] = {}
            for s_name in shift_names:
                assigned_employees = []
                for e in employees:
                    if x[e, d, s_name].x > 0.5:
                        assigned_employees.append(e)
                schedule[d][s_name] = assigned_employees

        total_cost = model.ObjVal
        return jsonify({'status': 'optimal', 'schedule': schedule, 'total_cost': total_cost})
    elif model.Status == GRB.INFEASIBLE:
        return jsonify({'status': 'infeasible', 'message': "No feasible solution found. The current availability of employees is not enough to generate a schedule that satisfies all conditions. Please adjust your inputs (e.g., increase availability, reduce minimum requirements, or add more employees)."}), 200
    elif model.Status == GRB.UNBOUNDED:
        return jsonify({'status': 'unbounded', 'message': "The model is unbounded, which means the objective can be infinitely improved. This usually indicates a problem in the model formulation."}), 200
    else:
        return jsonify({'status': 'error', 'message': f"Optimization stopped with status {model.Status}."}), 200

if __name__ == '__main__':
    app.run(debug=True) # debug=True allows automatic reloading on code changes
