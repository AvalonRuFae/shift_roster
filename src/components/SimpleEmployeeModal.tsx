import { useState } from "react";
import { Employee } from "@/types";

interface SimpleEmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (employeeData: Omit<Employee, "id">) => void;
	employee?: Employee | null;
	title: string;
}

const ROLE_OPTIONS = [
	{ key: "cashier", label: "Cashier" },
	{ key: "cook", label: "Cook" },
	{ key: "supervisor", label: "Supervisor" },
	{ key: "manager", label: "Manager" },
	{ key: "bartender", label: "Bartender" },
	{ key: "server", label: "Server" },
	{ key: "host", label: "Host" },
	{ key: "busser", label: "Busser" },
	{ key: "dishwasher", label: "Dishwasher" },
];

export default function SimpleEmployeeModal({
	isOpen,
	onClose,
	onSave,
	employee,
	title,
}: SimpleEmployeeModalProps) {
	const [name, setName] = useState(employee?.name || "");
	const [selectedRoles, setSelectedRoles] = useState<string[]>(
		employee?.roles || [],
	);
	const [maxHours, setMaxHours] = useState<number>(
		employee?.maxHoursPerWeek || 40,
	);

	if (!isOpen) return null;

	const handleSave = () => {
		if (!name.trim()) {
			alert("Please enter employee name");
			return;
		}

		if (selectedRoles.length === 0) {
			alert("Please select at least one role");
			return;
		}

		onSave({
			name: name.trim(),
			roles: selectedRoles,
			maxHoursPerWeek: maxHours,
		});

		// Reset form
		setName("");
		setSelectedRoles([]);
		setMaxHours(40);
		onClose();
	};

	const toggleRole = (roleKey: string) => {
		if (selectedRoles.includes(roleKey)) {
			setSelectedRoles(selectedRoles.filter((r) => r !== roleKey));
		} else {
			setSelectedRoles([...selectedRoles, roleKey]);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-lg rounded-2xl border border-separator/70 bg-background p-6 shadow-xl">
				<div className="mb-6">
					<h2 className="text-2xl font-semibold">{title}</h2>
					<p className="mt-1 text-sm text-muted">
						Add or edit employee details
					</p>
				</div>

				<div className="space-y-6">
					<div>
						<label className="mb-2 block text-sm font-medium">
							Employee Name
						</label>
						<input
							type="text"
							placeholder="Enter full name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded-lg border border-separator/70 bg-background px-4 py-3 focus:border-primary focus:outline-none"
						/>
					</div>

					<div>
						<p className="mb-2 text-sm font-medium">Select Roles</p>
						<div className="flex flex-wrap gap-2">
							{ROLE_OPTIONS.map((role) => (
								<button
									key={role.key}
									type="button"
									className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
										selectedRoles.includes(role.key)
											? "bg-primary text-primary-foreground"
											: "border border-separator/70 bg-background hover:bg-default-100"
									}`}
									onClick={() => toggleRole(role.key)}
								>
									{role.label}
								</button>
							))}
						</div>
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium">
							Maximum Hours Per Week
						</label>
						<input
							type="number"
							min="0"
							max="80"
							value={maxHours}
							onChange={(e) => setMaxHours(parseInt(e.target.value) || 40)}
							className="w-full rounded-lg border border-separator/70 bg-background px-4 py-3 focus:border-primary focus:outline-none"
						/>
						<p className="mt-1 text-xs text-muted">Default: 40 hours</p>
					</div>

					<div className="rounded-lg bg-default-100 p-4">
						<p className="text-sm font-medium">Selected Roles:</p>
						<div className="mt-2 flex flex-wrap gap-2">
							{selectedRoles.length > 0 ? (
								selectedRoles.map((roleKey) => {
									const role = ROLE_OPTIONS.find((r) => r.key === roleKey);
									return (
										<span
											key={roleKey}
											className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
										>
											{role?.label || roleKey}
										</span>
									);
								})
							) : (
								<p className="text-sm text-muted">No roles selected</p>
							)}
						</div>
					</div>
				</div>

				<div className="mt-8 flex justify-end gap-3">
					<button
						type="button"
						className="rounded-lg border border-separator/70 bg-background px-5 py-2.5 font-medium hover:bg-default-100"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						type="button"
						className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-primary/90"
						onClick={handleSave}
					>
						{employee ? "Update Employee" : "Create Employee"}
					</button>
				</div>
			</div>
		</div>
	);
}
