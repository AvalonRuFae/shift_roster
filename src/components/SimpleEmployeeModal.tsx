import { useState } from "react";
import { Employee } from "@/types";
import { Button } from "@heroui/react";

interface SimpleEmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (employeeData: Omit<Employee, "id">) => void;
	employee?: Employee | null;
	title: string;
}

// Default role options
const DEFAULT_ROLE_OPTIONS = [
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

	// Load custom roles from localStorage on component mount
	const [roleOptions, setRoleOptions] = useState(() => {
		// Try to load custom roles from localStorage
		try {
			const savedCustomRoles = localStorage.getItem(
				"shift_roster_custom_roles",
			);
			if (savedCustomRoles) {
				const customRoles = JSON.parse(savedCustomRoles);
				return [...DEFAULT_ROLE_OPTIONS, ...customRoles];
			}
		} catch (error) {
			console.error("Error loading custom roles:", error);
		}
		return DEFAULT_ROLE_OPTIONS;
	});

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

	const handleAddRole = () => {
		const newRoleName = prompt("Enter name for new role:");
		if (!newRoleName || !newRoleName.trim()) {
			return; // User cancelled or entered empty string
		}

		const trimmedName = newRoleName.trim();

		// Create a key from the role name (lowercase, replace spaces with hyphens)
		const newRoleKey = trimmedName.toLowerCase().replace(/\s+/g, "-");

		// Check if role already exists (in default or custom roles)
		if (roleOptions.some((role) => role.key === newRoleKey)) {
			alert(`Role "${trimmedName}" already exists!`);
			return;
		}

		// Create new role object
		const newRole = { key: newRoleKey, label: trimmedName };

		// Add new role to options
		const updatedRoleOptions = [...roleOptions, newRole];
		setRoleOptions(updatedRoleOptions);

		// Save custom roles to localStorage
		try {
			// Filter out default roles to save only custom ones
			const customRoles = updatedRoleOptions.filter(
				(role) =>
					!DEFAULT_ROLE_OPTIONS.some(
						(defaultRole) => defaultRole.key === role.key,
					),
			);
			localStorage.setItem(
				"shift_roster_custom_roles",
				JSON.stringify(customRoles),
			);
		} catch (error) {
			console.error("Error saving custom roles:", error);
		}

		// Automatically select the new role
		setSelectedRoles([...selectedRoles, newRoleKey]);

		alert(`Role "${trimmedName}" added and selected!`);
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
						<div className="mb-2 flex items-center justify-between">
							<p className="text-sm font-medium">Select Roles</p>
							<p className="text-xs text-muted">
								Custom roles are saved for future use
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							{roleOptions.map((role) => (
								<Button
									key={role.key}
									type="button"
									variant={
										selectedRoles.includes(role.key) ? "danger" : undefined
									}
									onClick={() => toggleRole(role.key)}
								>
									{role.label}
								</Button>
							))}
							<button
								type="button"
								className="rounded-full border border-dashed border-separator/70 bg-background px-4 py-2 text-sm font-medium hover:bg-default-100"
								onClick={handleAddRole}
								title="Add new role (saved in browser storage)"
							>
								+ Add Role
							</button>
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
									const role = roleOptions.find((r) => r.key === roleKey);
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
						className="rounded-lg border border-separator/70 bg-background px-5 py-2.5 font-medium text-primary-foreground hover:bg-primary/90"
						onClick={handleSave}
					>
						{employee ? "Update Employee" : "Create Employee"}
					</button>
				</div>
			</div>
		</div>
	);
}
