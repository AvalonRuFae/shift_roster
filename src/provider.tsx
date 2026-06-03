import { ShiftProvider } from "@/contexts/ShiftContext";

export function Provider({ children }: { children: React.ReactNode }) {
	return <ShiftProvider>{children}</ShiftProvider>;
}
