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

### Core Features (To Be Implemented):

- [ ] Employee management (add/edit/remove)
- [ ] Shift assignment to days/time slots
- [ ] Weekly schedule grid display
- [ ] Conflict detection (overlaps, >5 consecutive days)
- [ ] Summary panel with total hours per employee

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

### Utility Functions

- Time calculations handle 24-hour format
- Overlap detection considers partial overlaps
- Consecutive day detection handles week boundaries

## Next Steps

See instructions.md for complete requirements and implementation plan.
