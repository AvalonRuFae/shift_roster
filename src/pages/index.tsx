import DefaultLayout from "@/layouts/default";
import { Avatar, Button, Card, Chip, Input, Table } from "@heroui/react";

const dayColumns = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const metrics = [
	{ label: "Scheduled hours", value: "156", detail: "+12 from last week" },
	{ label: "Active employees", value: "8", detail: "2 supervisors on call" },
	{
		label: "Conflicts flagged",
		value: "2",
		detail: "1 overlap, 1 coverage gap",
	},
	{ label: "Coverage score", value: "91%", detail: "Weekend fill still open" },
];

const employees = [
	{
		name: "Maya Chen",
		role: "Supervisor · Front desk",
		hours: 38,
		avatar: "MC",
		availability: "Mon-Fri",
		status: "Fully covered",
		statusTone: "success" as const,
	},
	{
		name: "Jordan Lee",
		role: "Cook",
		hours: 34,
		avatar: "JL",
		availability: "Tue-Sat",
		status: "1 gap",
		statusTone: "warning" as const,
	},
	{
		name: "Sofia Patel",
		role: "Cashier",
		hours: 29,
		avatar: "SP",
		availability: "Evenings",
		status: "Balanced",
		statusTone: "primary" as const,
	},
	{
		name: "Noah Evans",
		role: "Supervisor · Stock",
		hours: 41,
		avatar: "NE",
		availability: "Weekend",
		status: "Over limit",
		statusTone: "danger" as const,
	},
	{
		name: "Ava Reed",
		role: "Cook",
		hours: 22,
		avatar: "AR",
		availability: "Mon, Wed, Fri",
		status: "Part-time",
		statusTone: "default" as const,
	},
];

const scheduleRows = [
	{
		name: "Maya Chen",
		role: "Supervisor",
		shifts: {
			Mon: ["06:00-14:00", "18:00-22:00"],
			Tue: ["06:00-14:00"],
			Wed: ["06:00-14:00"],
			Thu: ["06:00-14:00"],
			Fri: ["06:00-14:00"],
			Sat: ["Off"],
			Sun: ["Off"],
		},
	},
	{
		name: "Jordan Lee",
		role: "Cook",
		shifts: {
			Mon: ["Off"],
			Tue: ["12:00-20:00"],
			Wed: ["12:00-20:00"],
			Thu: ["12:00-20:00"],
			Fri: ["12:00-20:00"],
			Sat: ["09:00-17:00"],
			Sun: ["Off"],
		},
	},
	{
		name: "Sofia Patel",
		role: "Cashier",
		shifts: {
			Mon: ["14:00-22:00"],
			Tue: ["14:00-22:00"],
			Wed: ["Off"],
			Thu: ["14:00-22:00"],
			Fri: ["14:00-22:00"],
			Sat: ["10:00-18:00"],
			Sun: ["10:00-18:00"],
		},
	},
	{
		name: "Noah Evans",
		role: "Supervisor",
		shifts: {
			Mon: ["08:00-16:00"],
			Tue: ["08:00-16:00"],
			Wed: ["08:00-16:00"],
			Thu: ["08:00-16:00"],
			Fri: ["08:00-16:00"],
			Sat: ["08:00-16:00"],
			Sun: ["08:00-16:00"],
		},
	},
	{
		name: "Ava Reed",
		role: "Cook",
		shifts: {
			Mon: ["Off"],
			Tue: ["Off"],
			Wed: ["09:00-17:00"],
			Thu: ["Off"],
			Fri: ["09:00-17:00"],
			Sat: ["09:00-17:00"],
			Sun: ["Off"],
		},
	},
];

const conflictItems = [
	{
		title: "Maya Chen has overlapping Monday coverage",
		description:
			"Two shifts were assigned on the same day with a two-hour overlap.",
		tone: "danger" as const,
	},
	{
		title: "Noah Evans hits a seven-day streak",
		description: "The current plan exceeds the five-day consecutive work rule.",
		tone: "warning" as const,
	},
];

const summaryItems = [
	{ name: "Maya Chen", hours: 38, cap: 40 },
	{ name: "Jordan Lee", hours: 34, cap: 40 },
	{ name: "Sofia Patel", hours: 29, cap: 32 },
	{ name: "Noah Evans", hours: 41, cap: 40 },
	{ name: "Ava Reed", hours: 22, cap: 24 },
];

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

export default function IndexPage() {
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
													<Table.Row key={row.name}>
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
															const shifts =
																row.shifts[day as keyof typeof row.shifts];

															return (
																<Table.Cell key={`${row.name}-${day}`}>
																	<div className="flex flex-wrap gap-2">
																		{shifts.map((shift) => (
																			<Chip
																				key={`${row.name}-${day}-${shift}`}
																				className={
																					shift === "Off"
																						? getChipClassName("default")
																						: getChipClassName(
																								day === "Mon" &&
																									row.name === "Maya Chen" &&
																									shift === "18:00-22:00"
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
								{employees.map((employee) => (
									<div
										key={employee.name}
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
										<div key={item.name} className="space-y-2">
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
								{conflictItems.map((conflict) => (
									<div
										key={conflict.title}
										className="rounded-2xl border border-separator/70 bg-default-50 p-4"
									>
										<Chip className={getChipClassName(conflict.tone)}>
											{conflict.tone === "danger"
												? "Overlap"
												: "Consecutive days"}
										</Chip>
										<p className="mt-3 font-medium text-foreground">
											{conflict.title}
										</p>
										<p className="mt-1 text-sm text-muted">
											{conflict.description}
										</p>
									</div>
								))}
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
