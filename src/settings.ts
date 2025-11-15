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
	// NEW: Customizable notification messages
	workCompleteTitle: string;
	workCompleteMessage: string;
	shortBreakCompleteTitle: string;
	shortBreakCompleteMessage: string;
	longBreakCompleteTitle: string;
	longBreakCompleteMessage: string;
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
	workCompleteTitle: "Work Session Complete",
	workCompleteMessage: "Great job! Time for a break.",
	shortBreakCompleteTitle: "Short Break Complete",
	shortBreakCompleteMessage: "Break's over! Ready to focus?",
	longBreakCompleteTitle: "Long Break Complete",
	longBreakCompleteMessage: "Refreshed and ready! Let's get back to work.",
};