import { DayOfWeek, Shift, TimeSlot, Employee } from "@/types";

/**
 * Convert time string "HH:MM" to minutes since midnight
 */
export function timeToMinutes(time: string): number {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
}

/**
 * Check if two time slots overlap
 */
export function doTimeSlotsOverlap(
	start1: string,
	end1: string,
	start2: string,
	end2: string,
): boolean {
	const s1 = timeToMinutes(start1);
	const e1 = timeToMinutes(end1);
	const s2 = timeToMinutes(start2);
	const e2 = timeToMinutes(end2);

	return s1 < e2 && s2 < e1;
}

/**
 * Calculate shift duration in hours
 */
export function calculateShiftDuration(
	startTime: string,
	endTime: string,
): number {
	const startMinutes = timeToMinutes(startTime);
	const endMinutes = timeToMinutes(endTime);

	if (endMinutes < startMinutes) {
		// Handle overnight shifts (though not in requirements)
		return (endMinutes + 24 * 60 - startMinutes) / 60;
	}

	return (endMinutes - startMinutes) / 60;
}

/**
 * Parse time slot from shift
 */
export function getTimeSlotFromShift(shift: Shift): TimeSlot {
	const [startHour, startMinute] = shift.startTime.split(":").map(Number);
	const [endHour, endMinute] = shift.endTime.split(":").map(Number);

	return {
		startHour,
		startMinute,
		endHour,
		endMinute,
	};
}

/**
 * Get all shifts for a specific employee on a specific day
 */
export function getShiftsForEmployeeOnDay(
	shifts: Shift[],
	employeeId: string,
	day: DayOfWeek,
): Shift[] {
	return shifts.filter(
		(shift) => shift.employeeId === employeeId && shift.day === day,
	);
}

/**
 * Get all shifts grouped by employee and day
 */
export function getShiftsByEmployeeAndDay(
	shifts: Shift[],
): Record<string, Record<DayOfWeek, Shift[]>> {
	const result: Record<string, Record<DayOfWeek, Shift[]>> = {};

	shifts.forEach((shift) => {
		if (!result[shift.employeeId]) {
			result[shift.employeeId] = {
				Monday: [],
				Tuesday: [],
				Wednesday: [],
				Thursday: [],
				Friday: [],
				Saturday: [],
				Sunday: [],
			};
		}

		result[shift.employeeId][shift.day].push(shift);
	});

	return result;
}

/**
 * Check if an employee has overlapping shifts on the same day
 */
export function checkForOverlappingShifts(
	shifts: Shift[],
	employeeId: string,
	day: DayOfWeek,
): boolean {
	const dayShifts = getShiftsForEmployeeOnDay(shifts, employeeId, day);

	// Check all pairs of shifts for overlaps
	for (let i = 0; i < dayShifts.length; i++) {
		for (let j = i + 1; j < dayShifts.length; j++) {
			const shift1 = dayShifts[i];
			const shift2 = dayShifts[j];

			if (
				doTimeSlotsOverlap(
					shift1.startTime,
					shift1.endTime,
					shift2.startTime,
					shift2.endTime,
				)
			) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Check if an employee is scheduled for more than 5 consecutive days
 */
export function checkForConsecutiveDays(
	shifts: Shift[],
	employeeId: string,
): boolean {
	const employeeShifts = shifts.filter(
		(shift) => shift.employeeId === employeeId,
	);
	const daysWithShifts = new Set<DayOfWeek>();

	employeeShifts.forEach((shift) => {
		daysWithShifts.add(shift.day);
	});

	// Convert to array and sort by day order
	const daysArray = Array.from(daysWithShifts);
	const dayOrder = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];
	daysArray.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

	// Check for consecutive days (considering wrap-around from Sunday to Monday)
	let maxConsecutive = 0;
	let currentConsecutive = 0;

	for (let i = 0; i < daysArray.length; i++) {
		const currentDayIndex = dayOrder.indexOf(daysArray[i]);
		const prevDayIndex = i > 0 ? dayOrder.indexOf(daysArray[i - 1]) : -1;

		if (
			prevDayIndex === -1 ||
			currentDayIndex === prevDayIndex + 1 ||
			(prevDayIndex === 6 && currentDayIndex === 0)
		) {
			// Sunday to Monday
			currentConsecutive++;
		} else {
			currentConsecutive = 1;
		}

		maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
	}

	return maxConsecutive > 5;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}

/**
 * Format shift for display
 */
export function formatShift(shift: Shift): string {
	return `${shift.startTime}-${shift.endTime}`;
}

/**
 * Get employee name by ID
 */
export function getEmployeeName(
	employees: Employee[],
	employeeId: string,
): string {
	const employee = employees.find((emp) => emp.id === employeeId);
	return employee ? employee.name : "Unknown Employee";
}
