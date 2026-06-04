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

// Load initial state from localStorage or start with empty arrays
const loadFromLocalStorage = (): AppState => {
	try {
		const savedEmployees = localStorage.getItem("shift_roster_employees");
		const savedShifts = localStorage.getItem("shift_roster_shifts");

		const employees = savedEmployees ? JSON.parse(savedEmployees) : [];
		const shifts = savedShifts ? JSON.parse(savedShifts) : [];

		// Return initial state with loaded data
		return {
			employees,
			shifts,
			conflicts: [], // Conflicts will be recalculated
		};
	} catch (error) {
		console.error("Error loading from localStorage:", error);
		// Start with empty state if there's an error
		return {
			employees: [],
			shifts: [],
			conflicts: [],
		};
	}
};

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
	const [state, setState] = useState<AppState>(() => loadFromLocalStorage());

	// Helper function to save state to localStorage
	const saveToLocalStorage = useCallback((newState: AppState) => {
		try {
			localStorage.setItem(
				"shift_roster_employees",
				JSON.stringify(newState.employees),
			);
			localStorage.setItem(
				"shift_roster_shifts",
				JSON.stringify(newState.shifts),
			);
		} catch (error) {
			console.error("Error saving to localStorage:", error);
		}
	}, []);

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

			setState((prev) => {
				const newState = {
					...prev,
					employees: [...prev.employees, newEmployee],
				};
				saveToLocalStorage(newState);
				return newState;
			});

			return newEmployee;
		},
		[saveToLocalStorage],
	);

	const updateEmployee = useCallback(
		(id: string, updates: Partial<Employee>) => {
			setState((prev) => {
				const newState = {
					...prev,
					employees: prev.employees.map((emp) =>
						emp.id === id ? { ...emp, ...updates } : emp,
					),
				};
				saveToLocalStorage(newState);
				return newState;
			});
		},
		[saveToLocalStorage],
	);

	const removeEmployee = useCallback(
		(id: string) => {
			setState((prev) => {
				// Also remove all shifts for this employee
				const shiftsToKeep = prev.shifts.filter(
					(shift) => shift.employeeId !== id,
				);

				const newState = {
					...prev,
					employees: prev.employees.filter((emp) => emp.id !== id),
					shifts: shiftsToKeep,
				};
				saveToLocalStorage(newState);
				return newState;
			});
		},
		[saveToLocalStorage],
	);

	const addShift = useCallback(
		(shiftData: Omit<Shift, "id">): Shift => {
			const newShift: Shift = {
				...shiftData,
				id: generateId(),
			};

			setState((prev) => {
				const newState = {
					...prev,
					shifts: [...prev.shifts, newShift],
				};
				saveToLocalStorage(newState);
				return newState;
			});

			return newShift;
		},
		[saveToLocalStorage],
	);

	const updateShift = useCallback(
		(id: string, updates: Partial<Shift>) => {
			setState((prev) => {
				const newState = {
					...prev,
					shifts: prev.shifts.map((shift) =>
						shift.id === id ? { ...shift, ...updates } : shift,
					),
				};
				saveToLocalStorage(newState);
				return newState;
			});
		},
		[saveToLocalStorage],
	);

	const removeShift = useCallback(
		(id: string) => {
			setState((prev) => {
				const newState = {
					...prev,
					shifts: prev.shifts.filter((shift) => shift.id !== id),
				};
				saveToLocalStorage(newState);
				return newState;
			});
		},
		[saveToLocalStorage],
	);

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
