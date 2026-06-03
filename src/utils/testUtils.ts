import {
	timeToMinutes,
	doTimeSlotsOverlap,
	calculateShiftDuration,
} from "./shiftUtils";

// Test suite for utility functions
export function runUtilityTests(): string[] {
	const results: string[] = [];

	// Test 1: timeToMinutes
	const test1 = timeToMinutes("09:00") === 540;
	results.push(`timeToMinutes("09:00") = 540: ${test1 ? "PASS" : "FAIL"}`);

	const test2 = timeToMinutes("14:30") === 870;
	results.push(`timeToMinutes("14:30") = 870: ${test2 ? "PASS" : "FAIL"}`);

	// Test 2: doTimeSlotsOverlap
	const test3 = doTimeSlotsOverlap("09:00", "17:00", "13:00", "15:00") === true;
	results.push(`Overlap 09-17 with 13-15: ${test3 ? "PASS" : "FAIL"}`);

	const test4 =
		doTimeSlotsOverlap("09:00", "12:00", "13:00", "17:00") === false;
	results.push(`No overlap 09-12 with 13-17: ${test4 ? "PASS" : "FAIL"}`);

	const test5 = doTimeSlotsOverlap("09:00", "17:00", "08:00", "10:00") === true;
	results.push(`Overlap 09-17 with 08-10: ${test5 ? "PASS" : "FAIL"}`);

	// Test 3: calculateShiftDuration
	const test6 = calculateShiftDuration("09:00", "17:00") === 8;
	results.push(`Duration 09:00-17:00 = 8h: ${test6 ? "PASS" : "FAIL"}`);

	const test7 = calculateShiftDuration("08:30", "16:30") === 8;
	results.push(`Duration 08:30-16:30 = 8h: ${test7 ? "PASS" : "FAIL"}`);

	const test8 = calculateShiftDuration("14:00", "22:00") === 8;
	results.push(`Duration 14:00-22:00 = 8h: ${test8 ? "PASS" : "FAIL"}`);

	return results;
}
