"use client";

import { useState } from "react";
import { Kbd, Link, TextField, InputGroup } from "@heroui/react";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";

export const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const searchInput = (
		<TextField aria-label="Search" type="search">
			<InputGroup>
				<InputGroup.Prefix>
					<SearchIcon className="text-base text-muted pointer-events-none flex-shrink-0" />
				</InputGroup.Prefix>
				<InputGroup.Input className="text-sm" placeholder="Search..." />
				<InputGroup.Suffix>
					<Kbd className="hidden lg:inline-flex">
						<Kbd.Abbr keyValue="command" />
						<Kbd.Content>K</Kbd.Content>
					</Kbd>
				</InputGroup.Suffix>
			</InputGroup>
		</TextField>
	);

	return (
		<nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
			<header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
				<div className="flex items-center gap-4">
					<a className="flex items-center gap-1" href="#overview">
						<p className="font-semibold tracking-tight text-inherit">
							{siteConfig.name}
						</p>
					</a>
					<div className="hidden lg:flex items-center gap-5 text-sm text-muted">
						{siteConfig.navItems.map((item) => (
							<Link
								key={item.label}
								className="text-sm text-muted no-underline"
								href={item.href}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				<div className="hidden xl:flex w-full max-w-md">{searchInput}</div>

				<div className="hidden sm:flex items-center gap-3">
					<Link
						href={siteConfig.links.docs}
						rel="noopener noreferrer"
						target="_blank"
					>
						Docs
					</Link>
					<ThemeSwitch />
				</div>

				<div className="flex sm:hidden items-center gap-2">
					<ThemeSwitch />
					<button
						aria-expanded={isMenuOpen}
						aria-label="Toggle menu"
						className="p-2"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<svg
							className="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							{isMenuOpen ? (
								<path
									d="M6 18L18 6M6 6l12 12"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							) : (
								<path
									d="M4 6h16M4 12h16M4 18h16"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							)}
						</svg>
					</button>
				</div>
			</header>

			{isMenuOpen && (
				<div className="border-t border-separator sm:hidden">
					<div className="p-4">{searchInput}</div>
					<ul className="flex flex-col gap-2 px-4 pb-4">
						{siteConfig.navMenuItems.map((item, index) => (
							<li key={`${item.label}-${index}`}>
								<Link
									className={clsx(
										"block rounded-lg px-3 py-2 text-base no-underline text-foreground hover:bg-default-100",
									)}
									href={item.href}
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</nav>
	);
};
