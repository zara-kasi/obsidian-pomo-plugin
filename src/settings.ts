export interface PomodoroSettings {
	workDuration: number; // in minutes
	shortBreakDuration: number; // in minutes
	longBreakDuration: number; // in minutes
	sessionsUntilLongBreak: number;
	autoStartBreaks: boolean;
	autoStartWork: boolean;
	showNotifications: boolean;
	playSound: boolean;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
	workDuration: 25,
	shortBreakDuration: 5,
	longBreakDuration: 15,
	sessionsUntilLongBreak: 4,
	autoStartBreaks: false,
	autoStartWork: false,
	showNotifications: true,
	playSound: true,
};