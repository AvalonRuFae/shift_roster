import DefaultLayout from "@/layouts/default";
import { Avatar, Button, Card, Chip, Input, Table } from "@heroui/react";
import { useShiftContext } from "@/contexts/ShiftContext";
import { SHORT_DAY_ABBREVIATIONS, DayOfWeek } from "@/types";
import {
	getShiftsForEmployeeOnDay,
	formatShift,
	calculateShiftDuration,
} from "@/utils/shiftUtils";

const dayColumns = SHORT_DAY_ABBREVIATIONS;
const DAY_MAPPING: Record<string, DayOfWeek> = {
	Mon: "Monday",
	Tue: "Tuesday",
	Wed: "Wednesday",
	Thu: "Thursday",
	Fri: "Friday",
	Sat: "Saturday",
	Sun: "Sunday",
};

function getChipClassName(tone: string) {
	if (tone === "danger") {
		return "border border-danger/20 bg-danger/10 text-danger";
	}

	if (tone === "warning") {
		return "border border-warning/20 bg-warning/10 text-warning";
	}

	if (tone === "success") {
		return "border border-success/20 bg-success/10 text-success";
	}

	if (tone === "primary") {
		return "border border-primary/20 bg-primary/10 text-primary";
	}

	return "border border-default-200 bg-default-100 text-foreground";
}

// Helper function to get status tone based on hours
function getStatusTone(
	hours: number,
	cap: number = 40,
): "success" | "warning" | "danger" | "default" {
	if (hours >= cap) return "danger";
	if (hours >= cap * 0.9) return "warning";
	if (hours >= cap * 0.7) return "success";
	return "default";
}

// Helper function to get status text
function getStatusText(hours: number, cap: number = 40): string {
	if (hours >= cap) return "Over limit";
	if (hours >= cap * 0.9) return "Near limit";
	if (hours >= cap * 0.7) return "Good coverage";
	return "Part-time";
}

export default function IndexPage() {
	const { state, getEmployeeShifts, getTotalHoursForEmployee } =
		useShiftContext();

	// Calculate metrics dynamically
	const totalScheduledHours = state.shifts.reduce((total, shift) => {
		return total + calculateShiftDuration(shift.startTime, shift.endTime);
	}, 0);

	const activeEmployees = state.employees.length;
	const conflictsFlagged = state.conflicts.length;

	// Calculate coverage score (simplified)
	const totalPossibleHours = state.employees.length * 40; // Assuming 40h max per employee
	const coverageScore = Math.min(
		Math.round((totalScheduledHours / totalPossibleHours) * 100),
		100,
	);

	const metrics = [
		{
			label: "Scheduled hours",
			value: Math.round(totalScheduledHours).toString(),
			detail: "Total hours scheduled this week",
		},
		{
			label: "Active employees",
			value: activeEmployees.toString(),
			detail: `${state.employees.filter((e) => e.roles.includes("Supervisor")).length} supervisors on call`,
		},
		{
			label: "Conflicts flagged",
			value: conflictsFlagged.toString(),
			detail: `${state.conflicts.filter((c) => c.type === "overlap").length} overlap, ${state.conflicts.filter((c) => c.type === "consecutive_days").length} consecutive days`,
		},
		{
			label: "Coverage score",
			value: `${coverageScore}%`,
			detail: "Based on available hours vs scheduled",
		},
	];

	// Prepare schedule rows from real data
	const scheduleRows = state.employees.map((employee) => {
		// Group shifts by day
		const shiftsByDay: Record<string, string[]> = {};
		dayColumns.forEach((dayAbbr) => {
			const fullDay = DAY_MAPPING[dayAbbr];
			const dayShifts = getShiftsForEmployeeOnDay(
				state.shifts,
				employee.id,
				fullDay,
			);

			if (dayShifts.length === 0) {
				shiftsByDay[dayAbbr] = ["Off"];
			} else {
				shiftsByDay[dayAbbr] = dayShifts.map(formatShift);
			}
		});

		return {
			id: employee.id,
			name: employee.name,
			role: employee.roles.join(" · "),
			shifts: shiftsByDay,
		};
	});

	// Prepare employee cards from real data
	const employeeCards = state.employees.map((employee) => {
		const totalHours = getTotalHoursForEmployee(employee.id);
		const cap = employee.maxHoursPerWeek || 40;
		const statusTone = getStatusTone(totalHours, cap);
		const statusText = getStatusText(totalHours, cap);

		// Generate avatar initials
		const avatar = employee.name
			.split(" ")
			.map((part) => part[0])
			.join("");

		// Simple availability calculation (for demo)
		const employeeShifts = getEmployeeShifts(employee.id);
		const daysWithShifts = new Set(employeeShifts.map((s) => s.day));
		const availability =
			daysWithShifts.size > 0
				? `${daysWithShifts.size} days scheduled`
				: "No shifts assigned";

		return {
			id: employee.id,
			name: employee.name,
			role: employee.roles.join(" · "),
			hours: Math.round(totalHours),
			avatar,
			availability,
			status: statusText,
			statusTone,
		};
	});

	// Prepare summary items from real data
	const summaryItems = state.employees.map((employee) => {
		const totalHours = getTotalHoursForEmployee(employee.id);
		const cap = employee.maxHoursPerWeek || 40;

		return {
			id: employee.id,
			name: employee.name,
			hours: Math.round(totalHours),
			cap,
		};
	});

	// Check if shift has conflict
	const hasShiftConflict = (
		employeeId: string,
		dayAbbr: string,
		shiftText: string,
	): boolean => {
		if (shiftText === "Off") return false;

		const fullDay = DAY_MAPPING[dayAbbr];
		const employeeConflicts = state.conflicts.filter(
			(c) => c.employeeId === employeeId,
		);

		// Check for overlap conflicts on this day
		const overlapConflict = employeeConflicts.find(
			(c) => c.type === "overlap" && c.description.includes(fullDay),
		);

		return !!overlapConflict;
	};

	return (
		<DefaultLayout>
			<section className="flex w-full flex-col gap-6 pb-8" id="overview">
				<Card className="border border-separator/70 bg-background/80 shadow-sm backdrop-blur-xl">
					<Card.Header className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-3xl space-y-4">
							<Chip className="border border-primary/20 bg-primary/10 text-primary">
								Weekly roster
							</Chip>
							<div className="space-y-2">
								<Card.Title className="text-3xl tracking-tight sm:text-4xl">
									Shift Roster Builder
								</Card.Title>
								<Card.Description className="max-w-2xl text-base text-muted sm:text-lg">
									Build a weekly schedule, keep employees covered, and flag
									overlaps before the manager prints the roster.
								</Card.Description>
							</div>
						</div>
						<div className="flex flex-wrap gap-3">
							<Button className="bg-primary text-primary-foreground shadow-sm">
								Add shift
							</Button>
							<Button variant="secondary">Export CSV</Button>
						</div>
					</Card.Header>
					<Card.Content className="grid gap-4 border-t border-separator/60 p-6 md:grid-cols-2 xl:grid-cols-4">
						{metrics.map((metric) => (
							<div
								key={metric.label}
								className="rounded-2xl border border-separator/60 bg-default-50 p-4"
							>
								<p className="text-sm text-muted">{metric.label}</p>
								<p className="mt-2 text-3xl font-semibold tracking-tight">
									{metric.value}
								</p>
								<p className="mt-1 text-sm text-muted">{metric.detail}</p>
							</div>
						))}
					</Card.Content>
				</Card>

				<div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
					<div className="flex flex-col gap-6">
						<Card
							id="schedule"
							className="border border-separator/70 bg-background/80 shadow-sm"
						>
							<Card.Header className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
								<div>
									<Card.Title className="text-2xl">
										Weekly schedule grid
									</Card.Title>
									<Card.Description>
										Employees run down the rows, days run across the week.
									</Card.Description>
								</div>
								<Input
									className="w-full max-w-sm"
									placeholder="Search employees, roles, or shifts"
									type="search"
								/>
							</Card.Header>
							<Card.Content className="px-0 pb-0">
								<Table>
									<Table.ScrollContainer>
										<Table.Content aria-label="Weekly roster grid">
											<Table.Header>
												<Table.Column>Employee</Table.Column>
												{dayColumns.map((day) => (
													<Table.Column key={day}>{day}</Table.Column>
												))}
											</Table.Header>
											<Table.Body>
												{scheduleRows.map((row) => (
													<Table.Row key={row.id}>
														<Table.Cell>
															<div className="flex items-center gap-3">
																<Avatar className="h-10 w-10 border border-separator/70 bg-primary/10 text-sm font-semibold text-primary">
																	{row.name
																		.split(" ")
																		.map((part) => part[0])
																		.join("")}
																</Avatar>
																<div>
																	<p className="font-medium text-foreground">
																		{row.name}
																	</p>
																	<p className="text-sm text-muted">
																		{row.role}
																	</p>
																</div>
															</div>
														</Table.Cell>
														{dayColumns.map((day) => {
															const shifts = row.shifts[day];

															return (
																<Table.Cell key={`${row.id}-${day}`}>
																	<div className="flex flex-wrap gap-2">
																		{shifts.map((shift) => (
																			<Chip
																				key={`${row.id}-${day}-${shift}`}
																				className={
																					shift === "Off"
																						? getChipClassName("default")
																						: getChipClassName(
																								hasShiftConflict(
																									row.id,
																									day,
																									shift,
																								)
																									? "danger"
																									: "primary",
																							)
																				}
																			>
																				{shift}
																			</Chip>
																		))}
																	</div>
																</Table.Cell>
															);
														})}
													</Table.Row>
												))}
											</Table.Body>
										</Table.Content>
									</Table.ScrollContainer>
								</Table>
							</Card.Content>
						</Card>

						<Card
							id="team"
							className="border border-separator/70 bg-background/80 shadow-sm"
						>
							<Card.Header className="p-6 pb-0">
								<div>
									<Card.Title className="text-2xl">
										Employees and roles
									</Card.Title>
									<Card.Description>
										Add, edit, and remove people before assigning shifts.
									</Card.Description>
								</div>
							</Card.Header>
							<Card.Content className="space-y-4 p-6">
								{employeeCards.map((employee) => (
									<div
										key={employee.id}
										className="rounded-2xl border border-separator/70 bg-default-50 p-4"
									>
										<div className="flex items-start justify-between gap-3">
											<div className="flex items-center gap-3">
												<div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
													{employee.avatar}
												</div>
												<div>
													<p className="font-medium">{employee.name}</p>
													<p className="text-sm text-muted">{employee.role}</p>
												</div>
											</div>
											<Chip className={getChipClassName(employee.statusTone)}>
												{employee.status}
											</Chip>
										</div>
										<div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
											<div>
												<p>Weekly hours</p>
												<p className="mt-1 text-base font-medium text-foreground">
													{employee.hours}h
												</p>
											</div>
											<div>
												<p>Availability</p>
												<p className="mt-1 text-base font-medium text-foreground">
													{employee.availability}
												</p>
											</div>
										</div>
									</div>
								))}
							</Card.Content>
						</Card>
					</div>

					<div className="flex flex-col gap-6">
						<Card
							id="summary"
							className="border border-separator/70 bg-background/80 shadow-sm"
						>
							<Card.Header className="p-6 pb-0">
								<div>
									<Card.Title className="text-2xl">Hours summary</Card.Title>
									<Card.Description>
										Total weekly load by employee.
									</Card.Description>
								</div>
							</Card.Header>
							<Card.Content className="space-y-5 p-6">
								{summaryItems.map((item) => {
									const percent = Math.min((item.hours / item.cap) * 100, 100);

									return (
										<div key={item.id} className="space-y-2">
											<div className="flex items-center justify-between gap-3 text-sm">
												<span className="font-medium text-foreground">
													{item.name}
												</span>
												<span className="text-muted">
													{item.hours}/{item.cap}h
												</span>
											</div>
											<div className="h-2 overflow-hidden rounded-full bg-default-200">
												<div
													className="h-full rounded-full bg-primary"
													style={{ width: `${percent}%` }}
												/>
											</div>
										</div>
									);
								})}
							</Card.Content>
						</Card>

						<Card
							id="conflicts"
							className="border border-separator/70 bg-background/80 shadow-sm"
						>
							<Card.Header className="p-6 pb-0">
								<div>
									<Card.Title className="text-2xl">Conflict panel</Card.Title>
									<Card.Description>
										Flag overlaps and long streaks before publishing the roster.
									</Card.Description>
								</div>
							</Card.Header>
							<Card.Content className="space-y-3 p-6">
								{state.conflicts.length === 0 ? (
									<div className="rounded-2xl border border-separator/70 bg-default-50 p-4">
										<Chip className={getChipClassName("success")}>
											No conflicts
										</Chip>
										<p className="mt-3 font-medium text-foreground">
											Schedule looks good!
										</p>
										<p className="mt-1 text-sm text-muted">
											No overlapping shifts or consecutive day violations
											detected.
										</p>
									</div>
								) : (
									state.conflicts.map((conflict) => (
										<div
											key={`${conflict.employeeId}-${conflict.type}`}
											className="rounded-2xl border border-separator/70 bg-default-50 p-4"
										>
											<Chip className={getChipClassName(conflict.severity)}>
												{conflict.type === "overlap"
													? "Overlap"
													: "Consecutive days"}
											</Chip>
											<p className="mt-3 font-medium text-foreground">
												{conflict.description}
											</p>
											<p className="mt-1 text-sm text-muted">
												{conflict.details}
											</p>
										</div>
									))
								)}
							</Card.Content>
						</Card>

						<Card className="border border-separator/70 bg-background/80 shadow-sm">
							<Card.Header className="p-6 pb-0">
								<div>
									<Card.Title className="text-2xl">Quick actions</Card.Title>
									<Card.Description>
										Use these entry points to extend the live roster editor.
									</Card.Description>
								</div>
							</Card.Header>
							<Card.Content className="space-y-3 p-6">
								<Button className="w-full bg-primary text-primary-foreground">
									Create employee
								</Button>
								<Button className="w-full" variant="secondary">
									Assign shift
								</Button>
								<Button className="w-full" variant="secondary">
									Check conflicts
								</Button>
							</Card.Content>
						</Card>
					</div>
				</div>
			</section>
		</DefaultLayout>
	);
}
