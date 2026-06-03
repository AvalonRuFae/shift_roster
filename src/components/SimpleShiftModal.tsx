import { useState, useEffect } from "react";
import { Button, Select, Label, ListBox } from "@heroui/react";
import type { Key } from "@heroui/react";
import { Shift, DayOfWeek, Employee } from "@/types";
import { doTimeSlotsOverlap, calculateShiftDuration } from "@/utils/shiftUtils";

interface SimpleShiftModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (shiftData: Omit<Shift, "id">) => void;
	shift?: Shift | null;
	title: string;
	employees: Employee[];
	existingShifts: Shift[];
}

const DAY_OPTIONS: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const TIME_SLOTS = [
	"06:00",
	"07:00",
	"08:00",
	"09:00",
	"10:00",
	"11:00",
	"12:00",
	"13:00",
	"14:00",
	"15:00",
	"16:00",
	"17:00",
	"18:00",
	"19:00",
	"20:00",
	"21:00",
	"22:00",
	"23:00",
];

export default function SimpleShiftModal({
	isOpen,
	onClose,
	onSave,
	shift,
	title,
	employees,
	existingShifts,
}: SimpleShiftModalProps) {
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(
		shift?.employeeId || "",
	);
	const [selectedDay, setSelectedDay] = useState<DayOfWeek>(
		shift?.day || "Monday",
	);
	const [startTime, setStartTime] = useState(shift?.startTime || "09:00");
	const [endTime, setEndTime] = useState(shift?.endTime || "17:00");
	const [errors, setErrors] = useState<string[]>([]);

	const selectedEmployee = employees.find(
		(emp) => emp.id === selectedEmployeeId,
	);

	const validateShift = () => {
		const newErrors: string[] = [];

		if (!selectedEmployeeId) {
			newErrors.push("Please select an employee");
		}

		if (!selectedDay) {
			newErrors.push("Please select a day");
		}

		if (!startTime || !endTime) {
			newErrors.push("Please select both start and end times");
		}

		if (startTime && endTime) {
			const startHour = parseInt(startTime.split(":")[0]);
			const endHour = parseInt(endTime.split(":")[0]);

			if (endHour <= startHour) {
				newErrors.push("End time must be after start time");
			}

			if (endHour - startHour > 12) {
				newErrors.push("Shift cannot be longer than 12 hours");
			}
		}

		// Check for overlaps with existing shifts
		if (selectedEmployeeId && selectedDay && startTime && endTime) {
			const employeeShiftsOnDay = existingShifts.filter(
				(s) =>
					s.employeeId === selectedEmployeeId &&
					s.day === selectedDay &&
					(shift ? s.id !== shift.id : true), // Exclude current shift if editing
			);

			for (const existingShift of employeeShiftsOnDay) {
				if (
					doTimeSlotsOverlap(
						startTime,
						endTime,
						existingShift.startTime,
						existingShift.endTime,
					)
				) {
					newErrors.push(
						`Overlaps with existing shift: ${existingShift.startTime}-${existingShift.endTime}`,
					);
					break;
				}
			}
		}

		setErrors(newErrors);
		return newErrors.length === 0;
	};

	useEffect(() => {
		validateShift();
	}, [selectedEmployeeId, selectedDay, startTime, endTime]);

	// Reset form state when modal opens/closes or when shift prop changes
	useEffect(() => {
		if (isOpen) {
			// Set form values based on shift prop (if editing) or defaults (if creating)
			setSelectedEmployeeId(shift?.employeeId || "");
			setSelectedDay(shift?.day || "Monday");
			setStartTime(shift?.startTime || "09:00");
			setEndTime(shift?.endTime || "17:00");
			setErrors([]);
		}
	}, [isOpen, shift]);

	if (!isOpen) return null;

	const handleClose = () => {
		onClose();
	};

	const handleSave = () => {
		if (!validateShift()) {
			alert("Please fix the errors before saving");
			return;
		}

		if (!selectedEmployeeId || !selectedDay || !startTime || !endTime) {
			alert("Please fill in all fields");
			return;
		}

		onSave({
			employeeId: selectedEmployeeId,
			day: selectedDay,
			startTime,
			endTime,
		});

		onClose();
	};

	const calculateDuration = () => {
		if (!startTime || !endTime) return 0;
		return calculateShiftDuration(startTime, endTime);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-lg rounded-2xl border border-separator/70 bg-background p-6 shadow-xl">
				<div className="mb-6">
					<h2 className="text-2xl font-semibold">{title}</h2>
					<p className="mt-1 text-sm text-muted">
						Assign or edit shift details
					</p>
				</div>

				<div className="space-y-6">
					<div>
						<p className="mb-2 text-sm font-medium">Select Employee</p>
						<div className="flex flex-wrap gap-2">
							{employees.map((employee) => (
								<Button
									key={employee.id}
									size="sm"
									variant={
										employee.id == selectedEmployeeId ? "danger" : undefined
									}
									onPress={() => setSelectedEmployeeId(employee.id)}
								>
									{employee.name}
								</Button>
							))}
						</div>
					</div>

					<div>
						<p className="mb-2 text-sm font-medium">Select Day</p>
						<div className="flex flex-wrap gap-2">
							{DAY_OPTIONS.map((day) => (
								<Button
									key={day}
									size="sm"
									variant={day == selectedDay ? "danger" : undefined}
									onPress={() => setSelectedDay(day)}
								>
									{day.substring(0, 3)}
								</Button>
							))}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="mb-2 text-sm font-medium"></p>
							<Select
								className="w-full"
								placeholder="Select start time"
								value={startTime}
								onChange={(value) => setStartTime(value as string)}
							>
								<Label>Start Time</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
									<ListBox>
										{TIME_SLOTS.map((time) => (
											<ListBox.Item key={time} id={time} textValue={time}>
												{time}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
									</ListBox>
								</Select.Popover>
							</Select>
						</div>

						<div>
							<p className="mb-2 text-sm font-medium"></p>
							<Select
								className="w-full"
								placeholder="Select end time"
								value={endTime}
								onChange={(value) => setEndTime(value as string)}
							>
								<Label>End Time</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
									<ListBox>
										{TIME_SLOTS.map((time) => (
											<ListBox.Item key={time} id={time} textValue={time}>
												{time}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
									</ListBox>
								</Select.Popover>
							</Select>
						</div>
					</div>

					{selectedEmployee && (
						<div className="rounded-lg bg-primary/5 p-4">
							<p className="text-sm font-medium">Shift Details:</p>
							<div className="mt-2 grid grid-cols-2 gap-2 text-sm">
								<div>
									<span className="text-muted">Employee:</span>
									<p className="font-medium">{selectedEmployee.name}</p>
								</div>
								<div>
									<span className="text-muted">Duration:</span>
									<p className="font-medium">{calculateDuration()} hours</p>
								</div>
								<div>
									<span className="text-muted">Day:</span>
									<p className="font-medium">{selectedDay}</p>
								</div>
								<div>
									<span className="text-muted">Time:</span>
									<p className="font-medium">
										{startTime} - {endTime}
									</p>
								</div>
							</div>
						</div>
					)}

					{errors.length > 0 && (
						<div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
							<p className="font-medium text-danger">Validation Errors:</p>
							<ul className="mt-2 list-inside list-disc space-y-1 text-sm text-danger">
								{errors.map((error, index) => (
									<li key={index}>{error}</li>
								))}
							</ul>
						</div>
					)}
				</div>

				<div className="mt-8 flex justify-end gap-3">
					<Button onPress={handleClose}>Cancel</Button>
					<Button onPress={handleSave} isDisabled={errors.length > 0}>
						{shift ? "Update Shift" : "Assign Shift"}
					</Button>
				</div>
			</div>
		</div>
	);
}
