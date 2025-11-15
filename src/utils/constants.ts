import { SessionType } from "../types";

export const SESSION_LABELS: Record<SessionType, string> = {
	[SessionType.WORK]: "Work Session",
	[SessionType.SHORT_BREAK]: "Short Break",
	[SessionType.LONG_BREAK]: "Long Break",
};

export function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}