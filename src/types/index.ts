import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

// Employee types
export interface Employee {
	id: string;
	name: string;
	roles: string[]; // e.g., ["Cashier", "Supervisor", "Cook"]
	availability?: AvailabilityPreference[]; // optional stretch goal
	maxHoursPerWeek?: number; // optional maximum hours per week
}

export interface AvailabilityPreference {
	day: DayOfWeek;
	unavailable: boolean; // true if cannot work on this day
}

// Shift types
export interface Shift {
	id: string;
	employeeId: string;
	day: DayOfWeek;
	startTime: string; // format: "HH:MM" e.g., "09:00"
	endTime: string; // format: "HH:MM" e.g., "17:00"
}

// Conflict types
export interface Conflict {
	type: ConflictType;
	employeeId: string;
	description: string;
	severity: "warning" | "danger";
	details: string;
}

export type ConflictType = "overlap" | "consecutive_days" | "availability";

// Day of week enum
export type DayOfWeek =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

// For UI display - short day names
export const SHORT_DAYS: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

export const SHORT_DAY_ABBREVIATIONS = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun",
];

// Application state
export interface AppState {
	employees: Employee[];
	shifts: Shift[];
	conflicts: Conflict[];
}

// For time calculations
export interface TimeSlot {
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
}

// For summary calculations
export interface EmployeeSummary {
	employeeId: string;
	employeeName: string;
	totalHours: number;
	assignedShifts: number;
	conflicts: Conflict[];
}

// For drag and drop (stretch goal)
export interface DragDropEvent {
	sourceShiftId?: string;
	targetEmployeeId?: string;
	targetDay?: DayOfWeek;
	targetTimeSlot?: string;
}
