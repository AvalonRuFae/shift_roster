# Shift Roster Builder

A React-based web application for managers to create and manage weekly staff schedules.

## Project Structure

Built with:

- React 19 + TypeScript
- Vite for build tooling
- HeroUI for component library
- Tailwind CSS for styling

## Implementation Status

### ✅ **Commit 1 & 2: Foundation Complete**

- **Data models & types** defined
- **State management** with React Context
- **UI connected** to real state data
- **Automatic conflict detection** working

### ✅ **Commit 3 & 4: UI Interactions Wired Up**

**Employee Management:**

- ✅ Create employee (modal with form)
- ✅ Edit employee (edit button on cards)
- ✅ Delete employee (delete button on cards)
- ✅ Role selection with validation

**Shift Management:**

- ✅ Add shift (modal with form)
- ✅ Edit shift (click on shift chips)
- ✅ Delete shift (X button on shift chips)
- ✅ Time overlap validation
- ✅ Shift duration limits

**Core Features Working:**

- ✅ Search employees by name/role
- ✅ Export CSV functionality
- ✅ Manual conflict check
- ✅ Real-time schedule updates
- ✅ Dynamic metrics calculation

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

## How to Use the Application

### **1. Manage Employees**

- Click **"Create employee"** button to add new employees
- Click **"Edit"** button on employee cards to modify details
- Click **"Delete"** button to remove employees (also removes their shifts)

### **2. Manage Shifts**

- Click **"Add shift"** button to assign new shifts
- Click on any **shift chip** in the schedule grid to edit it
- Click **"×"** button on shift chips to delete them
- Automatic validation prevents overlapping shifts

### **3. Detect & Resolve Conflicts**

- Conflicts are automatically detected and shown in red
- Click **"Check conflicts"** button for manual check
- Fix conflicts by editing or deleting overlapping shifts

### **4. Export Data**

- Click **"Export CSV"** button to download schedule data
- CSV includes employee, day, times, and duration

### **5. Search & Filter**

- Use search box to find employees by name or role
- Schedule grid updates in real-time

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

## Testing Instructions

### **Test 1: Employee Management**

1. Click "Create employee" button
2. Enter name: "Test Employee"
3. Select roles: ["Cashier", "Cook"]
4. Click "Create Employee"
5. Verify new employee appears in list
6. Click "Edit" on the new employee
7. Change roles to ["Supervisor"]
8. Click "Update Employee"
9. Verify changes reflected
10. Click "Delete" on the new employee
11. Confirm deletion

### **Test 2: Shift Assignment**

1. Click "Add shift" button
2. Select an employee
3. Select day: "Wednesday"
4. Select time: 09:00-17:00
5. Click "Assign Shift"
6. Verify shift appears in schedule grid
7. Click on the new shift chip to edit
8. Change time to 10:00-18:00
9. Click "Update Shift"
10. Verify changes reflected
11. Click "×" button on shift to delete
12. Confirm deletion

### **Test 3: Conflict Detection**

1. Try to assign Maya Chen another shift on Monday 15:00-19:00
2. System should reject with overlap error
3. Check conflict panel shows Maya Chen overlap
4. Fix by deleting one of the overlapping shifts

### **Test 4: Export Functionality**

1. Click "Export CSV" button
2. Verify CSV file downloads
3. Open file to confirm data format

## Technical Architecture

### **State Management**

- React Context for global state
- In-memory data storage (no backend required)
- Automatic conflict detection on state changes

### **Data Models**

```typescript
interface Employee {
	id: string;
	name: string;
	roles: string[];
	maxHoursPerWeek?: number;
}

interface Shift {
	id: string;
	employeeId: string;
	day: DayOfWeek;
	startTime: string; // "HH:MM"
	endTime: string; // "HH:MM"
}
```

### **Conflict Detection**

- **Overlap detection**: Checks if two shifts for same employee on same day overlap
- **Consecutive days**: Flags employees working >5 days in a row
- **Automatic**: Runs whenever state changes
- **Real-time**: UI updates immediately

## Next Steps (Optional Enhancements)

1. **Drag & drop** shift reassignment
2. **Employee availability** preferences
3. **Print-friendly** roster view
4. **Mobile-responsive** layout improvements
5. **Shift templates** for common patterns
6. **Advanced filtering** (by role, day, hours)

## Troubleshooting

### **Common Issues:**

- **Modal doesn't open**: Check browser console for errors
- **Shift not saving**: Verify all required fields are filled
- **Conflict not detected**: Refresh page to trigger detection
- **CSV not downloading**: Check browser download settings

### **Development Commands:**

```bash
# TypeScript compilation check
npx tsc --noEmit

# Run tests
npm run test

# Build for production
npm run build
```

---

**The application is now fully functional with all core requirements implemented!**
