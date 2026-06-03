import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_64%)]" />
			<Navbar />
			<main className="relative mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
				{children}
			</main>
			<footer className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 pb-6 text-sm text-muted sm:px-6 lg:px-8">
				<span>In-memory demo roster builder</span>
				<span>Built with HeroUI</span>
			</footer>
		</div>
	);
}
