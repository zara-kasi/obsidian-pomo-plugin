export interface PomodoroSettings {
	workDuration: number; // in minutes
	shortBreakDuration: number; // in minutes
	longBreakDuration: number; // in minutes
	sessionsUntilLongBreak: number;
	autoStartBreaks: boolean;
	autoStartWork: boolean;
	autoStartOnLoad: boolean;
	showNotifications: boolean;
	playSound: boolean;
	playVibration: boolean;
	workColor: string;
	shortBreakColor: string;
	longBreakColor: string;
	// Simplified: Single notification message per session type
	workCompleteNotification: string;
	shortBreakCompleteNotification: string;
	longBreakCompleteNotification: string;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
	workDuration: 25,
	shortBreakDuration: 5,
	longBreakDuration: 15,
	sessionsUntilLongBreak: 4,
	autoStartBreaks: true,
	autoStartWork: true,
	autoStartOnLoad: false,
	showNotifications: true,
	playSound: true,
	playVibration: true,
	workColor: "",
	shortBreakColor: "",
	longBreakColor: "",
	workCompleteNotification: "Work session complete! Time for a break.",
	shortBreakCompleteNotification: "Short break complete! Ready to focus?",
	longBreakCompleteNotification: "Long break complete! Refreshed and ready to work.",
};