import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from "react";
import { Employee, Shift, Conflict, DayOfWeek, AppState } from "@/types";
import {
	checkForOverlappingShifts,
	checkForConsecutiveDays,
	generateId,
	calculateShiftDuration,
} from "@/utils/shiftUtils";

// Initial mock data matching the UI
const initialEmployees: Employee[] = [
	{ id: "1", name: "Maya Chen", roles: ["Supervisor", "Front desk"] },
	{ id: "2", name: "Jordan Lee", roles: ["Cook"] },
	{ id: "3", name: "Sofia Patel", roles: ["Cashier"] },
	{ id: "4", name: "Noah Evans", roles: ["Supervisor", "Stock"] },
	{ id: "5", name: "Ava Reed", roles: ["Cook"] },
];

const initialShifts: Shift[] = [
	// Maya Chen
	{
		id: "s1",
		employeeId: "1",
		day: "Monday",
		startTime: "06:00",
		endTime: "14:00",
	},
	{
		id: "s2",
		employeeId: "1",
		day: "Monday",
		startTime: "18:00",
		endTime: "22:00",
	},
	{
		id: "s3",
		employeeId: "1",
		day: "Tuesday",
		startTime: "06:00",
		endTime: "14:00",
	},
	{
		id: "s4",
		employeeId: "1",
		day: "Wednesday",
		startTime: "06:00",
		endTime: "14:00",
	},
	{
		id: "s5",
		employeeId: "1",
		day: "Thursday",
		startTime: "06:00",
		endTime: "14:00",
	},
	{
		id: "s6",
		employeeId: "1",
		day: "Friday",
		startTime: "06:00",
		endTime: "14:00",
	},

	// Jordan Lee
	{
		id: "s7",
		employeeId: "2",
		day: "Tuesday",
		startTime: "12:00",
		endTime: "20:00",
	},
	{
		id: "s8",
		employeeId: "2",
		day: "Wednesday",
		startTime: "12:00",
		endTime: "20:00",
	},
	{
		id: "s9",
		employeeId: "2",
		day: "Thursday",
		startTime: "12:00",
		endTime: "20:00",
	},
	{
		id: "s10",
		employeeId: "2",
		day: "Friday",
		startTime: "12:00",
		endTime: "20:00",
	},
	{
		id: "s11",
		employeeId: "2",
		day: "Saturday",
		startTime: "09:00",
		endTime: "17:00",
	},

	// Sofia Patel
	{
		id: "s12",
		employeeId: "3",
		day: "Monday",
		startTime: "14:00",
		endTime: "22:00",
	},
	{
		id: "s13",
		employeeId: "3",
		day: "Tuesday",
		startTime: "14:00",
		endTime: "22:00",
	},
	{
		id: "s14",
		employeeId: "3",
		day: "Thursday",
		startTime: "14:00",
		endTime: "22:00",
	},
	{
		id: "s15",
		employeeId: "3",
		day: "Friday",
		startTime: "14:00",
		endTime: "22:00",
	},
	{
		id: "s16",
		employeeId: "3",
		day: "Saturday",
		startTime: "10:00",
		endTime: "18:00",
	},
	{
		id: "s17",
		employeeId: "3",
		day: "Sunday",
		startTime: "10:00",
		endTime: "18:00",
	},

	// Noah Evans
	{
		id: "s18",
		employeeId: "4",
		day: "Monday",
		startTime: "08:00",
		endTime: "16:00",
	},
	{
		id: "s19",
		employeeId: "4",
		day: "Tuesday",
		startTime: "08:00",
		endTime: "16:00",
	},
	{
		id: "s20",
		employeeId: "4",
		day: "Wednesday",
		startTime: "08:00",
		endTime: "16:00",
	},
	{
		id: "s21",
		employeeId: "4",
		day: "Thursday",
		startTime: "08:00",
		endTime: "16:00",
	},
	{
		id: "s22",
		employeeId: "4",
		day: "Friday",
		startTime: "08:00",
		endTime: "16:00",
	},
	{
		id: "s23",
		employeeId: "4",
		day: "Saturday",
		startTime: "08:00",
		endTime: "16:00",
	},
	{
		id: "s24",
		employeeId: "4",
		day: "Sunday",
		startTime: "08:00",
		endTime: "16:00",
	},

	// Ava Reed
	{
		id: "s25",
		employeeId: "5",
		day: "Wednesday",
		startTime: "09:00",
		endTime: "17:00",
	},
	{
		id: "s26",
		employeeId: "5",
		day: "Friday",
		startTime: "09:00",
		endTime: "17:00",
	},
	{
		id: "s27",
		employeeId: "5",
		day: "Saturday",
		startTime: "09:00",
		endTime: "17:00",
	},
];

interface ShiftContextType {
	state: AppState;
	addEmployee: (employee: Omit<Employee, "id">) => Employee;
	updateEmployee: (id: string, updates: Partial<Employee>) => void;
	removeEmployee: (id: string) => void;
	addShift: (shift: Omit<Shift, "id">) => Shift;
	updateShift: (id: string, updates: Partial<Shift>) => void;
	removeShift: (id: string) => void;
	getEmployeeShifts: (employeeId: string) => Shift[];
	getShiftsByDay: (day: DayOfWeek) => Shift[];
	getTotalHoursForEmployee: (employeeId: string) => number;
	detectConflicts: () => Conflict[];
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const useShiftContext = () => {
	const context = useContext(ShiftContext);
	if (!context) {
		throw new Error("useShiftContext must be used within a ShiftProvider");
	}
	return context;
};

interface ShiftProviderProps {
	children: ReactNode;
}

export const ShiftProvider: React.FC<ShiftProviderProps> = ({ children }) => {
	const [state, setState] = useState<AppState>({
		employees: initialEmployees,
		shifts: initialShifts,
		conflicts: [],
	});

	// Detect conflicts whenever state changes
	const detectConflicts = useCallback((): Conflict[] => {
		const conflicts: Conflict[] = [];

		// Check each employee for overlaps
		state.employees.forEach((employee) => {
			// Check for overlapping shifts on same day
			const days = [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			] as DayOfWeek[];
			days.forEach((day) => {
				if (checkForOverlappingShifts(state.shifts, employee.id, day)) {
					conflicts.push({
						type: "overlap",
						employeeId: employee.id,
						description: `${employee.name} has overlapping shifts on ${day}`,
						severity: "danger",
						details:
							"Two shifts were assigned on the same day with overlapping times.",
					});
				}
			});

			// Check for more than 5 consecutive days
			if (checkForConsecutiveDays(state.shifts, employee.id)) {
				conflicts.push({
					type: "consecutive_days",
					employeeId: employee.id,
					description: `${employee.name} is scheduled for more than 5 consecutive days`,
					severity: "warning",
					details:
						"The current schedule exceeds the five-day consecutive work rule.",
				});
			}
		});

		return conflicts;
	}, [state.employees, state.shifts]);

	// Update conflicts when state changes
	React.useEffect(() => {
		const newConflicts = detectConflicts();
		setState((prev) => ({ ...prev, conflicts: newConflicts }));
	}, [state.employees, state.shifts, detectConflicts]);

	const addEmployee = useCallback(
		(employeeData: Omit<Employee, "id">): Employee => {
			const newEmployee: Employee = {
				...employeeData,
				id: generateId(),
			};

			setState((prev) => ({
				...prev,
				employees: [...prev.employees, newEmployee],
			}));

			return newEmployee;
		},
		[],
	);

	const updateEmployee = useCallback(
		(id: string, updates: Partial<Employee>) => {
			setState((prev) => ({
				...prev,
				employees: prev.employees.map((emp) =>
					emp.id === id ? { ...emp, ...updates } : emp,
				),
			}));
		},
		[],
	);

	const removeEmployee = useCallback(
		(id: string) => {
			// Also remove all shifts for this employee
			const shiftsToKeep = state.shifts.filter(
				(shift) => shift.employeeId !== id,
			);

			setState((prev) => ({
				...prev,
				employees: prev.employees.filter((emp) => emp.id !== id),
				shifts: shiftsToKeep,
			}));
		},
		[state.shifts],
	);

	const addShift = useCallback((shiftData: Omit<Shift, "id">): Shift => {
		const newShift: Shift = {
			...shiftData,
			id: generateId(),
		};

		setState((prev) => ({
			...prev,
			shifts: [...prev.shifts, newShift],
		}));

		return newShift;
	}, []);

	const updateShift = useCallback((id: string, updates: Partial<Shift>) => {
		setState((prev) => ({
			...prev,
			shifts: prev.shifts.map((shift) =>
				shift.id === id ? { ...shift, ...updates } : shift,
			),
		}));
	}, []);

	const removeShift = useCallback((id: string) => {
		setState((prev) => ({
			...prev,
			shifts: prev.shifts.filter((shift) => shift.id !== id),
		}));
	}, []);

	const getEmployeeShifts = useCallback(
		(employeeId: string): Shift[] => {
			return state.shifts.filter((shift) => shift.employeeId === employeeId);
		},
		[state.shifts],
	);

	const getShiftsByDay = useCallback(
		(day: DayOfWeek): Shift[] => {
			return state.shifts.filter((shift) => shift.day === day);
		},
		[state.shifts],
	);

	const getTotalHoursForEmployee = useCallback(
		(employeeId: string): number => {
			const employeeShifts = getEmployeeShifts(employeeId);
			return employeeShifts.reduce((total, shift) => {
				return total + calculateShiftDuration(shift.startTime, shift.endTime);
			}, 0);
		},
		[getEmployeeShifts],
	);

	const contextValue: ShiftContextType = {
		state,
		addEmployee,
		updateEmployee,
		removeEmployee,
		addShift,
		updateShift,
		removeShift,
		getEmployeeShifts,
		getShiftsByDay,
		getTotalHoursForEmployee,
		detectConflicts,
	};

	return (
		<ShiftContext.Provider value={contextValue}>
			{children}
		</ShiftContext.Provider>
	);
};
