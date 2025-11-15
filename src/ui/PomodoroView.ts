import { ItemView, WorkspaceLeaf, Notice, setIcon } from "obsidian";
import PomodoroPlugin from "../main";
import { PomodoroTimer } from "../utils/timer";
import { TimerState, SessionType, TimerData } from "../types";
import { formatTime, SESSION_LABELS } from "../utils/constants";

export const VIEW_TYPE_POMODORO = "pomodoro-timer-view";

export class PomodoroView extends ItemView {
	private timer: PomodoroTimer;
	private timerDisplayEl: HTMLElement;
	private sessionLabelEl: HTMLElement;
	private progressCircleEl: SVGCircleElement;
	private controlsEl: HTMLElement;
	private statsEl: HTMLElement;

	constructor(leaf: WorkspaceLeaf, private plugin: PomodoroPlugin) {
		super(leaf);
		this.timer = new PomodoroTimer(this.plugin.settings);
		this.setupTimerCallbacks();
	}

	getViewType(): string {
		return VIEW_TYPE_POMODORO;
	}

	getDisplayText(): string {
		return "Pomodoro Timer";
	}

	getIcon(): string {
		return "clock";
	}

	async onOpen(): Promise<void> {
		this.containerEl.empty();
		this.containerEl.addClass("pomodoro-container");

		this.createUI();
		this.updateUI(this.timer.getData());
	}

	async onClose(): Promise<void> {
		this.timer.cleanup();
	}

	private setupTimerCallbacks(): void {
	this.timer.onTick((data) => {
		this.updateUI(data);
	});

	this.timer.onComplete((sessionType) => {
		if (this.plugin.settings.showNotifications) {
			const { title, message } = this.getNotificationText(sessionType);
			
			// Combine title and message into a single string
			let notificationText = "";
			if (title && message) {
				notificationText = `${title}\n${message}`;
			} else if (title) {
				notificationText = title;
			} else if (message) {
				notificationText = message;
			}
			
			if (notificationText) {
				new Notice(notificationText);
			}
		}

		if (this.plugin.settings.playSound) {
			this.playNotificationSound();
		}

		if (this.plugin.settings.playVibration) {
			this.playVibration();
		}
	});
}

	private getNotificationText(sessionType: SessionType): { title: string; message: string } {
		const settings = this.plugin.settings;
		
		switch (sessionType) {
			case SessionType.WORK:
				return {
					title: settings.workCompleteTitle,
					message: settings.workCompleteMessage
				};
			case SessionType.SHORT_BREAK:
				return {
					title: settings.shortBreakCompleteTitle,
					message: settings.shortBreakCompleteMessage
				};
			case SessionType.LONG_BREAK:
				return {
					title: settings.longBreakCompleteTitle,
					message: settings.longBreakCompleteMessage
				};
			default:
				return { title: "", message: "" };
		}
	}

	private createUI(): void {
		// Header with session type
		this.sessionLabelEl = this.containerEl.createDiv("pomodoro-session-label");

		// Circular timer container
		const circularTimerContainer = this.containerEl.createDiv("pomodoro-circular-timer");
		
		// SVG for circular progress
		const svg = circularTimerContainer.createSvg("svg", {
			attr: {
				width: "280",
				height: "280",
				viewBox: "0 0 280 280"
			}
		});
		svg.addClass("pomodoro-circular-svg");

		// Background circle
		svg.createSvg("circle", {
			attr: {
				cx: "140",
				cy: "140",
				r: "120",
				fill: "none",
				stroke: "var(--background-modifier-border)",
				"stroke-width": "8"
			}
		});

		// Progress circle
		this.progressCircleEl = svg.createSvg("circle", {
			attr: {
				cx: "140",
				cy: "140",
				r: "120",
				fill: "none",
				"stroke-width": "8",
				"stroke-linecap": "round",
				transform: "rotate(-90 140 140)"
			}
		}) as SVGCircleElement;
		this.progressCircleEl.addClass("pomodoro-progress-circle");

		// Timer display (centered in circle)
		this.timerDisplayEl = circularTimerContainer.createDiv("pomodoro-timer-display");

		// Control buttons
		this.controlsEl = this.containerEl.createDiv("pomodoro-controls");
		this.createControls();

		// Stats
		this.statsEl = this.containerEl.createDiv("pomodoro-stats");
	}

	private createControls(): void {
		this.controlsEl.empty();

		const data = this.timer.getData();

		if (data.state === TimerState.RUNNING) {
			this.createButton("Pause", "pause", () => this.timer.pause());
		} else {
			this.createButton("Start", "play", () => this.timer.start());
		}

		this.createButton("Reset", "rotate-ccw", () => this.timer.reset());
		this.createButton("Skip", "skip-forward", () => this.timer.skip());
	}

	private createButton(label: string, icon: string, onClick: () => void): void {
		const button = this.controlsEl.createEl("button", {
			cls: "pomodoro-button",
			attr: { "aria-label": label }
		});
		
		// Use Obsidian's setIcon to add Lucide icons
		setIcon(button, icon);
		button.addEventListener("click", onClick);
	}

	private getSessionColor(sessionType: SessionType): string {
		// Get custom color from settings or fall back to accent color
		let customColor = "";
		
		if (sessionType === SessionType.WORK) {
			customColor = this.plugin.settings.workColor;
		} else if (sessionType === SessionType.SHORT_BREAK) {
			customColor = this.plugin.settings.shortBreakColor;
		} else if (sessionType === SessionType.LONG_BREAK) {
			customColor = this.plugin.settings.longBreakColor;
		}

		// Return custom color if set, otherwise return CSS variable for accent color
		return customColor || "var(--interactive-accent)";
	}

	private updateUI(data: TimerData): void {
		// Update session label (no emojis)
		const label = SESSION_LABELS[data.sessionType];
		this.sessionLabelEl.textContent = label;

		// Update timer display
		this.timerDisplayEl.textContent = formatTime(data.timeRemaining);

		// Update circular progress - arc shrinks as time decreases
		const progress = data.timeRemaining / data.totalTime; // Remaining ratio
		const radius = 120;
		const circumference = 2 * Math.PI * radius;
		const offset = circumference * (1 - progress); // Arc shrinks as progress decreases
		
		this.progressCircleEl.style.strokeDasharray = `${circumference}`;
		this.progressCircleEl.style.strokeDashoffset = `${offset}`;

		// Update progress color based on session type and user settings
		const color = this.getSessionColor(data.sessionType);
		this.progressCircleEl.style.stroke = color;

		// Update controls
		this.createControls();

		// Update stats - no emojis
		this.statsEl.textContent = `Completed sessions: ${data.completedSessions}`;
	}

	getTimer(): PomodoroTimer {
		return this.timer;
	}

	private playNotificationSound(): void {
		// Create a simple beep using Web Audio API
		try {
			const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = 800;
			oscillator.type = 'sine';

			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.5);
		} catch (error) {
			console.error('Failed to play notification sound:', error);
		}
	}

	private playVibration(): void {
		// Check if vibration API is supported
		if ('vibrate' in navigator) {
			try {
				// Vibrate in a pattern: vibrate for 200ms, pause 100ms, vibrate 200ms
				navigator.vibrate([200, 100, 200]);
			} catch (error) {
				console.error('Failed to vibrate:', error);
			}
		}
	}
}