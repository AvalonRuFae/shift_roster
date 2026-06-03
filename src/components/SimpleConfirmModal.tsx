interface SimpleConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
}

export default function SimpleConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
}: SimpleConfirmModalProps) {
	if (!isOpen) return null;

	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-md rounded-2xl border border-separator/70 bg-background p-6 shadow-xl">
				<div className="mb-6">
					<h2 className="text-2xl font-semibold">{title}</h2>
					<p className="mt-2 text-muted">{message}</p>
				</div>

				<div className="flex justify-end gap-3">
					<button
						type="button"
						className="rounded-lg border border-separator/70 bg-background px-5 py-2.5 font-medium hover:bg-default-100"
						onClick={onClose}
					>
						{cancelText}
					</button>
					<button
						type="button"
						className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700"
						onClick={handleConfirm}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
