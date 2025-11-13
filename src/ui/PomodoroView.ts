import { ItemView, WorkspaceLeaf, Notice } from "obsidian";
import PomodoroPlugin from "../main";
import { PomodoroTimer } from "../utils/timer";
import { TimerState, SessionType, TimerData } from "../types";
import { formatTime, SESSION_LABELS, SESSION_EMOJIS } from "../utils/constants";

export const VIEW_TYPE_POMODORO = "pomodoro-timer-view";

export class PomodoroView extends ItemView {
	private timer: PomodoroTimer;
	private containerEl: HTMLElement;
	private timerDisplayEl: HTMLElement;
	private sessionLabelEl: HTMLElement;
	private progressBarEl: HTMLElement;
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
		this.containerEl = this.contentEl;
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
				const message = sessionType === SessionType.WORK
					? "Work session completed! Time for a break."
					: "Break is over! Ready to focus?";
				new Notice(message);
			}

			if (this.plugin.settings.playSound) {
				// Play system notification sound
				const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSx+zPLTgjMGHm7A7+OZRA0PWqvm8KtVFw1Jp+Hxv2whBSt8yvLWhTQHGW66"/>
			}
		});
	}

	private createUI(): void {
		// Header with session type
		this.sessionLabelEl = this.containerEl.createDiv("pomodoro-session-label");

		// Timer display
		this.timerDisplayEl = this.containerEl.createDiv("pomodoro-timer-display");

		// Progress bar
		const progressContainer = this.containerEl.createDiv("pomodoro-progress-container");
		this.progressBarEl = progressContainer.createDiv("pomodoro-progress-bar");

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
		
		// Add icon (using simple text for compatibility)
		const iconMap: Record<string, string> = {
			"play": "▶",
			"pause": "⏸",
			"rotate-ccw": "↻",
			"skip-forward": "⏭"
		};
		
		button.textContent = iconMap[icon] || label;
		button.addEventListener("click", onClick);
	}

	private updateUI(data: TimerData): void {
		// Update session label
		const emoji = SESSION_EMOJIS[data.sessionType];
		const label = SESSION_LABELS[data.sessionType];
		this.sessionLabelEl.textContent = `${emoji} ${label}`;

		// Update timer display
		this.timerDisplayEl.textContent = formatTime(data.timeRemaining);

		// Update progress bar
		const progress = ((data.totalTime - data.timeRemaining) / data.totalTime) * 100;
		this.progressBarEl.style.width = `${progress}%`;

		// Update progress bar color based on session type
		this.progressBarEl.className = "pomodoro-progress-bar";
		if (data.sessionType === SessionType.WORK) {
			this.progressBarEl.addClass("work");
		} else if (data.sessionType === SessionType.SHORT_BREAK) {
			this.progressBarEl.addClass("short-break");
		} else {
			this.progressBarEl.addClass("long-break");
		}

		// Update controls
		this.createControls();

		// Update stats
		this.statsEl.textContent = `Completed: ${data.completedSessions} 🍅`;
	}

	getTimer(): PomodoroTimer {
		return this.timer;
	}
}