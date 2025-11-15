export interface PomodoroSettings {
	workDuration: number; // in minutes
	shortBreakDuration: number; // in minutes
	longBreakDuration: number; // in minutes
	sessionsUntilLongBreak: number;
	autoStartBreaks: boolean;
	autoStartWork: boolean;
	autoStartOnLoad: boolean; // NEW: Auto-start timer when plugin loads
	showNotifications: boolean;
	playSound: boolean;
	playVibration: boolean; // NEW: Vibrate on session completion
	workColor: string;
	shortBreakColor: string;
	longBreakColor: string;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
	workDuration: 25,
	shortBreakDuration: 5,
	longBreakDuration: 15,
	sessionsUntilLongBreak: 4,
	autoStartBreaks: false,
	autoStartWork: false,
	autoStartOnLoad: false,
	showNotifications: true,
	playSound: true,
	playVibration: false,
	workColor: "",
	shortBreakColor: "",
	longBreakColor: "",
};