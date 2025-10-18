# Linear Programming Model for Shift Scheduling Application

## Model Overview

This scheduling application uses a **Binary Integer Linear Programming (BILP)** model implemented with **Gurobi Optimizer** to generate optimal employee work schedules. The model minimizes total labor costs while satisfying various operational constraints including employee availability, working hours limits, staffing requirements, and responsible person coverage.

The optimization problem is formulated as a cost minimization problem where the objective is to assign employees to shifts across multiple days while respecting all business rules and constraints.

## Problem Context

The application is designed for the **horeca sector in Belgium**, supporting both full-time and part-time workers with flexible scheduling requirements. The system accommodates various employment types, availability patterns, wage structures, and operational constraints typical in hospitality, restaurant, and catering businesses.

## Sets and Indices

- **E**: Set of employees (e.g., {e1, e2, e3, ..., en})
- **D**: Set of working days (e.g., {Mon, Tue, Wed, Thu, Fri, Sat, Sun})
- **S**: Set of shift types (e.g., {Morning, Afternoon, Evening})

## Parameters

### Employee-Specific Parameters
- **avail(e,d,s)**: Availability of employee e for shift s on day d (Binary: 0/1)
- **min_hours(e)**: Minimum weekly working hours for employee e (Integer)
- **max_hours(e)**: Maximum weekly working hours for employee e (Integer)
- **wage(e)**: Hourly wage rate for employee e (Real number)
- **responsible(e)**: Whether employee e can be a responsible person (Binary: 0/1)

### Shift-Specific Parameters
- **hours(s)**: Duration of shift s in hours (Real number)
- **min_emp(d,s)**: Minimum number of employees required for shift s on day d (Integer)
- **max_emp(d,s)**: Maximum number of employees allowed for shift s on day d (Integer)

### System Parameters
- **resp_required**: Whether at least one responsible person is required per shift (Binary: 0/1)
- **fulltime_hours**: Standard weekly hours for full-time employees (Integer)

## Decision Variables

The model uses a single type of decision variable:

**x(e,d,s)** ∈ {0, 1} for all employees e, days d, and shifts s

Where:
- **x(e,d,s) = 1** if employee e is assigned to shift s on day d
- **x(e,d,s) = 0** otherwise

## Objective Function

**Minimize total labor cost:**

**Minimize Z = Σ Σ Σ wage(e) × hours(s) × x(e,d,s)**
(Sum over all employees e, days d, and shifts s)

The objective function calculates the total variable labor cost by summing the product of:
- Employee hourly wage rate
- Shift duration 
- Assignment decision variable

*Note: Full-time employees typically have wage = 0 in the model since their cost is considered fixed salary rather than variable hourly cost.*

## Constraints

### 1. Employee Availability Constraint
Employees can only be assigned to shifts when they are available:

**x(e,d,s) = 0** for all employees e, days d, shifts s where **avail(e,d,s) = 0**

### 2. Minimum Weekly Hours Constraint
Each employee must work at least their minimum required hours per week:

**Σ Σ hours(s) × x(e,d,s) ≥ min_hours(e)** for all employees e where min_hours(e) > 0
(Sum over all days d and shifts s)

### 3. Maximum Weekly Hours Constraint
Each employee cannot exceed their maximum allowed hours per week:

**Σ Σ hours(s) × x(e,d,s) ≤ max_hours(e)** for all employees e where max_hours(e) > 0
(Sum over all days d and shifts s)

### 4. Minimum Staffing Constraint
Each shift must have at least the minimum required number of employees:

**Σ x(e,d,s) ≥ min_emp(d,s)** for all days d, shifts s where min_emp(d,s) > 0
(Sum over all employees e)

### 5. Maximum Staffing Constraint
Each shift cannot have more than the maximum allowed number of employees:

**Σ x(e,d,s) ≤ max_emp(d,s)** for all days d, shifts s where max_emp(d,s) > 0
(Sum over all employees e)

### 6. Responsible Person Constraint
If required, at least one responsible person must be assigned to each shift:

**Σ responsible(e) × x(e,d,s) ≥ 1** for all days d, shifts s if resp_required = 1
(Sum over all employees e)

## Model Implementation Details

### Technology Stack
- **Optimization Solver**: Gurobi Optimizer 11.0.0
- **Programming Language**: Python 3.9+
- **Modeling Interface**: gurobipy (Gurobi Python API)
- **Web Framework**: Flask 3.0.0



### Solution Status Handling
The model handles various solution outcomes:

1. **OPTIMAL**: Feasible solution found with proven optimality
2. **INFEASIBLE**: No solution exists that satisfies all constraints
3. **UNBOUNDED**: Objective can be improved indefinitely (indicates model error)
4. **ERROR**: Solver encountered an error during optimization

## Model Characteristics

### Problem Classification
- **Type**: Binary Integer Linear Programming
- **Complexity**: NP-hard (due to integer variables)
- **Structure**: Assignment problem with side constraints



