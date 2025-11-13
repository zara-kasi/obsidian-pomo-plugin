export enum TimerState {
	IDLE = "idle",
	RUNNING = "running",
	PAUSED = "paused",
}

export enum SessionType {
	WORK = "work",
	SHORT_BREAK = "short-break",
	LONG_BREAK = "long-break",
}

export interface TimerData {
	state: TimerState;
	sessionType: SessionType;
	timeRemaining: number; // in seconds
	totalTime: number; // in seconds
	completedSessions: number;
}