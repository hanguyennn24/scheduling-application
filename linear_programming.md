# Linear Programming Model for Shift Scheduling Application

## Model Overview

This scheduling application uses a **Binary Integer Linear Programming (BILP)** model implemented with **Gurobi Optimizer** to generate optimal employee work schedules. The model minimizes total labor costs while satisfying various operational constraints including employee availability, working hours limits, staffing requirements, and responsible person coverage.

The optimization problem is formulated as a cost minimization problem where the objective is to assign employees to shifts across multiple days while respecting all business rules and constraints.

## Problem Context

The application is designed for the **horeca sector in Belgium**, supporting both full-time and part-time workers with flexible scheduling requirements. The system accommodates various employment types, availability patterns, wage structures, and operational constraints typical in hospitality, restaurant, and catering businesses.

## Sets and Indices

| Set | Description | Example |
|-----|-------------|---------|
| $E$ | Set of employees | $\{e_1, e_2, e_3, ..., e_n\}$ |
| $D$ | Set of working days | $\{\text{Mon, Tue, Wed, Thu, Fri, Sat, Sun}\}$ |
| $S$ | Set of shift types | $\{\text{Morning, Afternoon, Evening}\}$ |

## Parameters

### Employee-Specific Parameters
| Parameter | Description | Type |
|-----------|-------------|------|
| $\text{avail}_{e,d,s}$ | Availability of employee $e$ for shift $s$ on day $d$ | Binary (0/1) |
| $\text{min\_hours}_e$ | Minimum weekly working hours for employee $e$ | Integer |
| $\text{max\_hours}_e$ | Maximum weekly working hours for employee $e$ | Integer |
| $\text{wage}_e$ | Hourly wage rate for employee $e$ | Real |
| $\text{responsible}_e$ | Whether employee $e$ can be a responsible person | Binary (0/1) |

### Shift-Specific Parameters
| Parameter | Description | Type |
|-----------|-------------|------|
| $\text{hours}_s$ | Duration of shift $s$ in hours | Real |
| $\text{min\_emp}_{d,s}$ | Minimum number of employees required for shift $s$ on day $d$ | Integer |
| $\text{max\_emp}_{d,s}$ | Maximum number of employees allowed for shift $s$ on day $d$ | Integer |

### System Parameters
| Parameter | Description | Type |
|-----------|-------------|------|
| $\text{resp\_required}$ | Whether at least one responsible person is required per shift | Binary (0/1) |
| $\text{fulltime\_hours}$ | Standard weekly hours for full-time employees | Integer |

## Decision Variables

The model uses a single type of decision variable:

$$x_{e,d,s} \in \{0, 1\} \quad \forall e \in E, d \in D, s \in S$$

Where:
- $x_{e,d,s} = 1$ if employee $e$ is assigned to shift $s$ on day $d$
- $x_{e,d,s} = 0$ otherwise

## Objective Function

**Minimize total labor cost:**

$$\text{Minimize} \quad Z = \sum_{e \in E} \sum_{d \in D} \sum_{s \in S} \text{wage}_e \times \text{hours}_s \times x_{e,d,s}$$

The objective function calculates the total variable labor cost by summing the product of:
- Employee hourly wage rate
- Shift duration 
- Assignment decision variable

*Note: Full-time employees typically have wage = 0 in the model since their cost is considered fixed salary rather than variable hourly cost.*

## Constraints

### 1. Employee Availability Constraint
Employees can only be assigned to shifts when they are available:

$$x_{e,d,s} = 0 \quad \forall e \in E, d \in D, s \in S \text{ where } \text{avail}_{e,d,s} = 0$$

### 2. Minimum Weekly Hours Constraint
Each employee must work at least their minimum required hours per week:

$$\sum_{d \in D} \sum_{s \in S} \text{hours}_s \times x_{e,d,s} \geq \text{min\_hours}_e \quad \forall e \in E \text{ where } \text{min\_hours}_e > 0$$

### 3. Maximum Weekly Hours Constraint
Each employee cannot exceed their maximum allowed hours per week:

$$\sum_{d \in D} \sum_{s \in S} \text{hours}_s \times x_{e,d,s} \leq \text{max\_hours}_e \quad \forall e \in E \text{ where } \text{max\_hours}_e > 0$$

### 4. Minimum Staffing Constraint
Each shift must have at least the minimum required number of employees:

$$\sum_{e \in E} x_{e,d,s} \geq \text{min\_emp}_{d,s} \quad \forall d \in D, s \in S \text{ where } \text{min\_emp}_{d,s} > 0$$

### 5. Maximum Staffing Constraint
Each shift cannot have more than the maximum allowed number of employees:

$$\sum_{e \in E} x_{e,d,s} \leq \text{max\_emp}_{d,s} \quad \forall d \in D, s \in S \text{ where } \text{max\_emp}_{d,s} > 0$$

### 6. Responsible Person Constraint
If required, at least one responsible person must be assigned to each shift:

$$\sum_{e \in E} \text{responsible}_e \times x_{e,d,s} \geq 1 \quad \forall d \in D, s \in S \text{ if } \text{resp\_required} = 1$$

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



