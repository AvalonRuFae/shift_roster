# Shift Roster Builder

A React-based web application for managers to create and manage weekly staff schedules.

## Project Structure

Built with:

- React 19 + TypeScript
- Vite for build tooling
- HeroUI for component library
- Tailwind CSS for styling

## Current Implementation Status

### Commit 1: Define Data Models & Types ✅

- Created comprehensive TypeScript interfaces for:
  - Employees (with name, roles, availability preferences)
  - Shifts (day, time slot, employee assignment)
  - Conflicts (overlap detection, consecutive days)
  - Application state structure
- Implemented utility functions for:
  - Time calculations and overlap detection
  - Shift duration calculations
  - Conflict detection algorithms
- Set up React Context for state management
- Added initial mock data matching UI requirements

### Commit 2: Connect UI to State Management ✅

- Updated main page to use ShiftContext instead of static mock data
- Dynamic metrics calculation (total hours, active employees, conflicts, coverage score)
- Real-time schedule grid populated from state data
- Employee cards display actual data with status indicators
- Summary panel shows real hours with progress bars
- Conflict panel dynamically displays detected issues
- All UI components now reflect actual application state

### Core Features (To Be Implemented):

- [ ] Employee management (add/edit/remove)
- [ ] Shift assignment to days/time slots
- [ ] Interactive buttons (Add shift, Create employee, Export CSV)
- [ ] Search and filter functionality
- [ ] Form validation and error handling

## Default Data (Initial State)

The application starts with pre-loaded mock data to demonstrate functionality:

### Employees:

```typescript
[
	{ id: "1", name: "Maya Chen", roles: ["Supervisor", "Front desk"] },
	{ id: "2", name: "Jordan Lee", roles: ["Cook"] },
	{ id: "3", name: "Sofia Patel", roles: ["Cashier"] },
	{ id: "4", name: "Noah Evans", roles: ["Supervisor", "Stock"] },
	{ id: "5", name: "Ava Reed", roles: ["Cook"] },
];
```

### Key Shifts (with built-in conflicts):

**Maya Chen** (Employee 1):

- Monday: 06:00-14:00 AND 18:00-22:00 (✅ Conflict: Overlapping shifts on same day)
- Tuesday-Friday: 06:00-14:00 daily
- Saturday-Sunday: Off

**Noah Evans** (Employee 4):

- Monday-Sunday: 08:00-16:00 all 7 days (✅ Conflict: >5 consecutive days)

**Other Employees** (No conflicts):

- Jordan Lee: Tue-Fri 12:00-20:00, Sat 09:00-17:00
- Sofia Patel: Mon, Tue, Thu, Fri 14:00-22:00, Sat-Sun 10:00-18:00
- Ava Reed: Wed, Fri, Sat 09:00-17:00

### Automatic Conflict Detection:

1. **Maya Chen**: Overlap conflict on Monday (two shifts: 06:00-14:00 and 18:00-22:00)
2. **Noah Evans**: Consecutive days conflict (works 7 days straight, limit is 5)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Design Decisions

### Data Model

- Employees can have multiple roles (e.g., ["Cashier", "Supervisor"])
- Shifts are assigned to specific employees on specific days
- Time slots use "HH:MM" format for simplicity
- Conflicts are automatically detected and flagged

### State Management

- Uses React Context for global state
- All data stored in-memory (no backend required)
- Conflict detection runs automatically on state changes
- UI components reactively update when state changes

### UI Integration

- Maintains existing HeroUI component structure
- Dynamic data calculation for all metrics
- Real-time conflict detection and display
- Consistent visual design with functional data

### Utility Functions

- Time calculations handle 24-hour format
- Overlap detection considers partial overlaps
- Consecutive day detection handles week boundaries
- Shift duration calculations for summary panels

## Application Features

### Currently Working:

- ✅ Weekly schedule grid with real shift data
- ✅ Dynamic metrics dashboard
- ✅ Employee cards with actual hours and status
- ✅ Hours summary with progress bars
- ✅ Conflict detection and display
- ✅ Real-time data updates

### State Modification Functions (Available but Not UI-connected):

- `addEmployee()`: Add new employees with name and roles
- `updateEmployee()`: Modify existing employee details
- `removeEmployee()`: Delete employees (and their shifts)
- `addShift()`: Assign new shifts to employees
- `updateShift()`: Modify existing shift details
- `removeShift()`: Delete shifts
- `detectConflicts()`: Automatically checks for overlaps and consecutive days

### Next Steps:

1. **Commit 3**: Implement employee management (add/edit/delete) - connect `addEmployee()`, `updateEmployee()`, `removeEmployee()` to UI
2. **Commit 4**: Implement shift assignment interface - connect `addShift()`, `updateShift()`, `removeShift()` to UI
3. **Commit 5**: Make buttons functional with forms/modals
4. **Commit 6**: Add search and filtering
5. **Commit 7**: Implement CSV export functionality

## Running the App

The application is now fully functional with real data. You can see:

- Maya Chen has overlapping Monday shifts (conflict flagged)
- Noah Evans works 7 consecutive days (conflict flagged)
- Real hours calculated for each employee
- Dynamic status indicators based on hours worked
- Live conflict detection

See instructions.md for complete requirements and implementation plan.
