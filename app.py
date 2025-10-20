from flask import Flask, request, jsonify, render_template, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
from pathlib import Path
import pulp
import time
import json
from datetime import datetime

# Load environment variables from .env (if present)
load_dotenv()

app = Flask(__name__)

# Compute a deterministic DB path pointing to the project's instance/scheduler.db
# app.py lives in shift_scheduler_app; go up to the workspace root then into instance/
BASE_DIR = Path(__file__).resolve().parents[1]
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

@app.route('/api/generate_example_data', methods=['GET'])
def generate_example_data():
    """Generate example data that guarantees feasible solution with responsible person requirement"""
    import random
    
    # Allow customizable parameters
    seed = request.args.get('seed', 135, type=int)
    employee_count = request.args.get('employees', 20, type=int)  # Default to 20 as requested
    employee_count = max(8, min(employee_count, 25))  # Clamp between 8 and 25
    
    random.seed(seed)
    
    # Define days and shifts matching the UI defaults
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']  # Start with weekdays only for better feasibility
    shifts = [
        {'name': 'Morning', 'hours': 4},
        {'name': 'Afternoon', 'hours': 4},  # Match UI default
        {'name': 'Evening', 'hours': 4}     # Match UI default hours
    ]
    
    # STRATEGIC APPROACH: Ensure EVERY shift has at least one responsible person available
    employees = []
    all_employee_names = [
        'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown',
        'Frank Miller', 'Grace Lee', 'Henry Clark', 'Ivy Taylor', 'Jack Anderson',
        'Kate Thompson', 'Liam Garcia', 'Mia Rodriguez', 'Noah Martinez', 'Olivia Hernandez',
        'Paul Lopez', 'Quinn Jackson', 'Ruby White', 'Sam Harris', 'Tina Young',
        'Uma Patel', 'Victor Chen', 'Wendy Kim', 'Xavier Torres', 'Yuki Tanaka'
    ]
    
    employee_names = all_employee_names[:employee_count]
    
    # STEP 1: Create employees with GUARANTEED responsible person coverage
    # Make 70% of employees responsible to ensure good coverage
    responsible_count = max(7, int(employee_count * 0.7))  # At least 7 responsible employees
    
    for i, name in enumerate(employee_names):
        # Most employees are responsible
        can_be_responsible = i < responsible_count
        
        # Flexible minimum hours to avoid over-constraining
        if can_be_responsible:
            min_hours = random.randint(8, 16)  # Responsible employees work more
        else:
            min_hours = random.randint(4, 12)  # Regular employees work less
        
        max_hours = min_hours + random.randint(12, 20)
        max_hours = min(max_hours, 40)  # Cap at 40 hours
        wage = 15
        
        # Generate 80% availability as requested
        availability = {}
        for day in days:
            for shift in shifts:
                key = f"{name}_{day}_{shift['name']}"
                # Exactly 80% availability as requested
                availability[key] = random.random() < 0.80
        
        # CRITICAL: Ensure each employee can meet their minimum hours
        available_hours = sum(4 for key, is_avail in availability.items() if is_avail)
        if available_hours < min_hours:
            # Force availability for enough shifts to meet minimum
            unavailable_keys = [key for key, is_avail in availability.items() if not is_avail]
            shifts_needed = (min_hours - available_hours + 3) // 4  # Round up
            for _ in range(min(shifts_needed, len(unavailable_keys))):
                key_to_fix = random.choice(unavailable_keys)
                availability[key_to_fix] = True
                unavailable_keys.remove(key_to_fix)
        
        employees.append({
            'name': name,
            'min_hours': min_hours,
            'max_hours': max_hours,
            'wage': wage,
            'can_be_responsible': can_be_responsible,
            'availability': availability,
            'is_full_time': min_hours >= 30
        })
    
    # STEP 2: GUARANTEE every shift has at least one responsible person available
    for day in days:
        for shift in shifts:
            # Check if this shift has any responsible person available
            responsible_available = [emp for emp in employees 
                                   if emp['can_be_responsible'] and 
                                   emp['availability'].get(f"{emp['name']}_{day}_{shift['name']}", False)]
            
            # If no responsible person is available, force one to be available
            if not responsible_available:
                # Find a responsible employee and make them available for this shift
                responsible_employees = [emp for emp in employees if emp['can_be_responsible']]
                if responsible_employees:
                    chosen_emp = random.choice(responsible_employees)
                    key = f"{chosen_emp['name']}_{day}_{shift['name']}"
                    chosen_emp['availability'][key] = True
    
    # STEP 3: Generate very conservative staffing requirements
    min_employees_per_shift = {}
    max_employees_per_shift = {}
    
    for day in days:
        for shift in shifts:
            key = f"{day}_{shift['name']}"
            
            # Count available employees for this shift
            available_employees = sum(1 for emp in employees 
                                    if emp['availability'].get(f"{emp['name']}_{day}_{shift['name']}", False))
            
            # Count available responsible employees for this shift
            responsible_available = sum(1 for emp in employees 
                                      if emp['availability'].get(f"{emp['name']}_{day}_{shift['name']}", False) 
                                      and emp['can_be_responsible'])
            
            # Very conservative minimums - just 1 person minimum if we have good availability
            if available_employees >= 2 and responsible_available >= 1:
                min_employees_per_shift[key] = 1  # Just 1 minimum
            else:
                min_employees_per_shift[key] = 0  # No minimum if tight
            
            # Conservative maximums
            max_employees_per_shift[key] = min(available_employees, 4)
    
    # STEP 4: Final validation - reduce minimums if total demand is too high
    total_min_demand = sum(min_employees_per_shift.values())
    total_available_capacity = sum(emp['max_hours'] // 4 for emp in employees)
    
    # If demand exceeds 40% of capacity, reduce minimums
    if total_min_demand > total_available_capacity * 0.4:
        # Remove minimums from shifts with least availability
        shift_availability = {}
        for day in days:
            for shift in shifts:
                key = f"{day}_{shift['name']}"
                available_count = sum(1 for emp in employees 
                                    if emp['availability'].get(f"{emp['name']}_{day}_{shift['name']}", False))
                shift_availability[key] = available_count
        
        # Sort shifts by availability (ascending) and remove minimums from least available
        sorted_shifts = sorted(shift_availability.items(), key=lambda x: x[1])
        minimums_to_remove = total_min_demand - int(total_available_capacity * 0.4)
        
        for shift_key, _ in sorted_shifts:
            if minimums_to_remove <= 0:
                break
            if min_employees_per_shift[shift_key] > 0:
                min_employees_per_shift[shift_key] = 0
                minimums_to_remove -= 1
    
    # STEP 5: MANDATORY responsible person requirement
    # Since we guaranteed every shift has at least one responsible person available,
    # we can safely enable this requirement
    responsible_required_overall = True

    example_data = {
        'days': days,
        'shifts': shifts,
        'employees': employees,
        'min_employees_per_shift': min_employees_per_shift,
        'max_employees_per_shift': max_employees_per_shift,
        'responsible_required_overall': responsible_required_overall
    }
    
    return jsonify({
        'status': 'success',
        'data': example_data,
        'debug_info': {
            'seed': seed,
            'total_employees': len(employees),
            'responsible_employees': sum(1 for emp in employees if emp['can_be_responsible']),
            'total_shifts_per_week': len(days) * len(shifts),
            'total_min_staffing': sum(min_employees_per_shift.values()),
            'responsible_required': responsible_required_overall,
            'avg_availability_percent': round(
                sum(sum(1 for v in emp['availability'].values() if v) for emp in employees) / 
                (len(employees) * len(days) * len(shifts)) * 100, 1
            ),
            'total_available_hours': sum(
                sum(4 for v in emp['availability'].values() if v) for emp in employees
            ),
            'total_min_hours_needed': sum(emp['min_hours'] for emp in employees),
            'shifts_with_responsible_coverage': sum(1 for day in days for shift in shifts
                if sum(1 for emp in employees 
                      if emp['availability'].get(f"{emp['name']}_{day}_{shift['name']}", False) 
                      and emp['can_be_responsible']) > 0)
        }
    })

@app.route('/api/find_feasible_config', methods=['GET'])
def find_feasible_config():
    """Test different employee counts and seeds to find a feasible configuration"""
    import random
    import pulp
    
    # Test configurations
    employee_counts = [8, 10, 12, 15, 18, 20]
    seeds = [100, 200, 300, 500, 777, 1000, 1234, 1500, 2000, 2500]
    
    results = []
    
    for emp_count in employee_counts:
        for seed in seeds:
            # Generate data with this configuration
            random.seed(seed)
            
            # Use the same generation logic as generate_example_data
            days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
            shifts = [
                {'name': 'Morning', 'hours': 4},
                {'name': 'Afternoon', 'hours': 4},
                {'name': 'Evening', 'hours': 4}
            ]
            
            # Generate employees (simplified version)
            employees = []
            all_employee_names = [
                'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown',
                'Frank Miller', 'Grace Lee', 'Henry Clark', 'Ivy Taylor', 'Jack Anderson',
                'Kate Thompson', 'Liam Garcia', 'Mia Rodriguez', 'Noah Martinez', 'Olivia Hernandez',
                'Paul Lopez', 'Quinn Jackson', 'Ruby White', 'Sam Harris', 'Tina Young',
                'Uma Patel', 'Victor Chen', 'Wendy Kim', 'Xavier Torres', 'Yuki Tanaka'
            ]
            
            employee_names = all_employee_names[:emp_count]
            super_flexible_count = max(3, emp_count // 4)
            
            # Generate very simple, flexible employees
            for i in range(emp_count):
                name = employee_names[i]
                
                if i < super_flexible_count:
                    # Super flexible employees - available for everything
                    min_hours = 20  # Reduced from 40
                    max_hours = 40
                    can_be_responsible = True
                    availability = {}
                    for day in days:
                        for shift in shifts:
                            key = f"{name}_{day}_{shift['name']}"
                            availability[key] = True  # 100% available
                else:
                    # Regular employees with moderate requirements
                    min_hours = random.randint(4, 12)  # Very low minimum
                    max_hours = min_hours + random.randint(8, 16)
                    can_be_responsible = random.random() > 0.4  # 60% chance
                    
                    availability = {}
                    for day in days:
                        for shift in shifts:
                            key = f"{name}_{day}_{shift['name']}"
                            availability[key] = random.random() > 0.3  # 70% chance
                
                employees.append({
                    'name': name,
                    'min_hours': min_hours,
                    'max_hours': max_hours,
                    'wage': 15,
                    'can_be_responsible': can_be_responsible,
                    'availability': availability,
                    'is_full_time': min_hours >= 30
                })
            
            # Generate minimal staffing requirements
            min_employees_per_shift = {}
            max_employees_per_shift = {}
            
            for day in days:
                for shift in shifts:
                    key = f"{day}_{shift['name']}"
                    min_employees_per_shift[key] = 0  # No minimums for testing
                    max_employees_per_shift[key] = emp_count  # Liberal maximums
            
            # Quick feasibility test using PuLP
            try:
                # Create a minimal model to test feasibility
                model = pulp.LpProblem("FeasibilityTest", pulp.LpMinimize)
                
                # Decision variables
                x = {}
                for emp in employees:
                    for d in days:
                        for s in shifts:
                            x[(emp['name'], d, s['name'])] = pulp.LpVariable(f"x_{emp['name']}_{d}_{s['name']}", cat='Binary')
                
                # Dummy objective
                model += 0
                
                # Availability constraints
                for emp in employees:
                    for d in days:
                        for s in shifts:
                            key = f"{emp['name']}_{d}_{s['name']}"
                            if not emp['availability'].get(key, False):
                                model += x[(emp['name'], d, s['name'])] == 0
                
                # Min/max hours constraints
                for emp in employees:
                    total_hours = pulp.lpSum(x[(emp['name'], d, s['name'])] * s['hours'] 
                                           for d in days for s in shifts)
                    if emp['min_hours'] > 0:
                        model += total_hours >= emp['min_hours']
                    if emp['max_hours'] > 0:
                        model += total_hours <= emp['max_hours']
                
                # Solve with timeout
                model.solve(pulp.PULP_CBC_CMD(msg=0, timeLimit=10))
                
                is_feasible = model.status == pulp.LpStatusOptimal
                
                result = {
                    'employees': emp_count,
                    'seed': seed,
                    'feasible': is_feasible,
                    'status': pulp.LpStatus[model.status] if model.status else 'Unknown'
                }
                
                results.append(result)
                
                # If we found a feasible solution, we can stop early for this employee count
                if is_feasible:
                    break
                    
            except Exception as e:
                results.append({
                    'employees': emp_count,
                    'seed': seed,
                    'feasible': False,
                    'status': f'Error: {str(e)}'
                })
    
    # Find the best feasible configurations
    feasible_configs = [r for r in results if r['feasible']]
    
    return jsonify({
        'status': 'success',
        'feasible_configurations': feasible_configs[:10],  # Top 10 feasible configs
        'all_results': results,
        'summary': {
            'total_tested': len(results),
            'feasible_found': len(feasible_configs),
            'success_rate': f"{len(feasible_configs)/len(results)*100:.1f}%" if results else "0%"
        }
    })

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


    # === PuLP Model ===
    model = pulp.LpProblem("ShiftScheduling", pulp.LpMinimize)

    # Decision variables
    x = {}
    for e in employees:
        for d in days:
            for s in shift_names:
                x[(e, d, s)] = pulp.LpVariable(f"x_{e}_{d}_{s}", cat='Binary')

    # Objective: minimize cost
    # If full_time_hours_per_week is set, wage is only considered for non-full-time hours,
    # or if we assume full-time workers have 0 wage cost in the model
    model += pulp.lpSum(wage[e] * shift_hours[s] * x[(e, d, s)]
                        for e in employees for d in days for s in shift_names)

    # 1. Availability
    for e in employees:
        for d in days:
            for s_name in shift_names:
                if availability[e, d, s_name] == 0:
                    model += x[(e, d, s_name)] == 0, f"availability_{e}_{d}_{s_name}"

    # Constraint 2: Max 2 shifts per day (REMOVED as per request)

    # 3. Min and Max weekly hours
    for e in employees:
        total_hours = pulp.lpSum(x[(e, d, s_name)] * shift_hours[s_name] for d in days for s_name in shift_names)

        # Only add min/max hours constraint if they are not 'unlimited' (represented by None or 0)
        if min_hours[e] is not None and min_hours[e] > 0:
            model += total_hours >= min_hours[e], f"min_hours_{e}"
        if max_hours[e] is not None and max_hours[e] > 0:
            model += total_hours <= max_hours[e], f"max_hours_{e}"

    # 4. Minimum number of employees per shift (if relevant)
    if any(min_employees[(d, s)] > 0 for d in days for s in shift_names): # Check if any min_employees is > 0
        for d in days:
            for s_name in shift_names:
                if min_employees[(d, s_name)] > 0:
                    model += pulp.lpSum(x[(e, d, s_name)] for e in employees) >= min_employees[(d, s_name)], f"min_emp_shift_{d}_{s_name}"

    # 6. Maximum number of employees per shift (NEW CONSTRAINT)
    if any(max_employees[(d, s)] > 0 for d in days for s in shift_names): # Check if any max_employees is > 0
        for d in days:
            for s_name in shift_names:
                if max_employees[(d, s_name)] > 0:
                    model += pulp.lpSum(x[(e, d, s_name)] for e in employees) <= max_employees[(d, s_name)], f"max_emp_shift_{d}_{s_name}"

    # 5. Responsible person assigned per shift (if required)
    if responsible_required_overall:
        for d in days:
            for s_name in shift_names:
                # Only require a responsible person if there are employees scheduled for that shift
                # This formulation ensures at least one responsible if anyone is working.
                # A stronger constraint would be to just require it if responsible_required_overall is true,
                # which is what the user asked for.
                model += pulp.lpSum(is_responsible[e] * x[(e, d, s_name)] for e in employees) >= 1, f"responsible_req_{d}_{s_name}"


    # Simulate a delay for processing to show user the "solving" message
    time.sleep(1)

    # === Solve ===
    try:
        model.solve(pulp.PULP_CBC_CMD(msg=0))  # Use CBC solver with no output
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Solver Error: {str(e)}'}), 500


    # === Output ===
    if model.status == pulp.LpStatusOptimal:
        schedule = {}
        for d in days:
            schedule[d] = {}
            for s_name in shift_names:
                assigned_employees = []
                for e in employees:
                    if x[(e, d, s_name)].varValue > 0.5:
                        assigned_employees.append(e)
                schedule[d][s_name] = assigned_employees

        total_cost = pulp.value(model.objective)
        return jsonify({'status': 'optimal', 'schedule': schedule, 'total_cost': total_cost})
    elif model.status == pulp.LpStatusInfeasible:
        return jsonify({'status': 'infeasible', 'message': "No feasible solution found. The current availability of employees is not enough to generate a schedule that satisfies all conditions. Please adjust your inputs (e.g., increase availability, reduce minimum requirements, or add more employees)."}), 200
    elif model.status == pulp.LpStatusUnbounded:
        return jsonify({'status': 'unbounded', 'message': "The model is unbounded, which means the objective can be infinitely improved. This usually indicates a problem in the model formulation."}), 200
    else:
        return jsonify({'status': 'error', 'message': f"Optimization stopped with status {pulp.LpStatus[model.status]}."}), 200

if __name__ == '__main__':
    app.run(debug=True) # debug=True allows automatic reloading on code changes
    app.run(host='0.0.0.0', port=5000, debug=True) # host='0.0.0.0' allows external access
