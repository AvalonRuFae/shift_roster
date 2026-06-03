export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Shift Roster Builder",
	description:
		"Plan weekly staffing, spot conflicts, and keep coverage balanced.",
	navItems: [
		{
			label: "Overview",
			href: "#overview",
		},
		{
			label: "Team",
			href: "#team",
		},
		{
			label: "Schedule",
			href: "#schedule",
		},
		{
			label: "Conflicts",
			href: "#conflicts",
		},
		{
			label: "Summary",
			href: "#summary",
		},
	],
	navMenuItems: [
		{
			label: "Overview",
			href: "#overview",
		},
		{
			label: "Team",
			href: "#team",
		},
		{
			label: "Schedule",
			href: "#schedule",
		},
		{
			label: "Conflicts",
			href: "#conflicts",
		},
		{
			label: "Summary",
			href: "#summary",
		},
	],
	links: {
		github: "https://github.com/heroui-inc/heroui",
		twitter: "https://twitter.com/hero_ui",
		docs: "https://heroui.com",
		discord: "https://discord.gg/9b6yyZKmH4",
		sponsor: "https://patreon.com/jrgarciadev",
	},
};
