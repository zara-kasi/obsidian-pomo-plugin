import { TimerState, SessionType, TimerData } from "../types";
import { PomodoroSettings } from "../settings";

export class PomodoroTimer {
	private data: TimerData;
	private intervalId: number | null = null;
	private onTickCallbacks: Array<(data: TimerData) => void> = [];
	private onCompleteCallbacks: Array<(sessionType: SessionType) => void> = [];

	constructor(private settings: PomodoroSettings) {
		this.data = {
			state: TimerState.IDLE,
			sessionType: SessionType.WORK,
			timeRemaining: this.settings.workDuration * 60,
			totalTime: this.settings.workDuration * 60,
			completedSessions: 0,
		};
	}

	getData(): TimerData {
		return { ...this.data };
	}

	start(): void {
		if (this.data.state === TimerState.RUNNING) return;

		this.data.state = TimerState.RUNNING;
		this.intervalId = window.setInterval(() => {
			this.tick();
		}, 1000);
		this.notifyTick();
	}

	pause(): void {
		if (this.data.state !== TimerState.RUNNING) return;

		this.data.state = TimerState.PAUSED;
		if (this.intervalId !== null) {
			window.clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.notifyTick();
	}

	reset(): void {
		this.stop();
		this.data.timeRemaining = this.data.totalTime;
		this.data.state = TimerState.IDLE;
		this.notifyTick();
	}

	skip(): void {
		this.stop();
		this.completeSession();
		this.notifyTick();
	}

	private stop(): void {
		this.data.state = TimerState.IDLE;
		if (this.intervalId !== null) {
			window.clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	private tick(): void {
		this.data.timeRemaining--;

		if (this.data.timeRemaining <= 0) {
			this.stop();
			this.completeSession();
		}

		this.notifyTick();
	}

	private completeSession(): void {
		const completedType = this.data.sessionType;
		this.notifyComplete(completedType);

		if (completedType === SessionType.WORK) {
			this.data.completedSessions++;
			this.startBreak();
		} else {
			this.startWork();
		}
	}

	private startWork(): void {
		this.data.sessionType = SessionType.WORK;
		this.data.totalTime = this.settings.workDuration * 60;
		this.data.timeRemaining = this.data.totalTime;

		if (this.settings.autoStartWork) {
			this.start();
		} else {
			this.data.state = TimerState.IDLE;
		}
	}

	private startBreak(): void {
		const isLongBreak = this.data.completedSessions % this.settings.sessionsUntilLongBreak === 0;
		
		this.data.sessionType = isLongBreak ? SessionType.LONG_BREAK : SessionType.SHORT_BREAK;
		this.data.totalTime = isLongBreak 
			? this.settings.longBreakDuration * 60
			: this.settings.shortBreakDuration * 60;
		this.data.timeRemaining = this.data.totalTime;

		if (this.settings.autoStartBreaks) {
			this.start();
		} else {
			this.data.state = TimerState.IDLE;
		}
	}

	onTick(callback: (data: TimerData) => void): void {
		this.onTickCallbacks.push(callback);
	}

	onComplete(callback: (sessionType: SessionType) => void): void {
		this.onCompleteCallbacks.push(callback);
	}

	private notifyTick(): void {
		this.onTickCallbacks.forEach((cb) => cb(this.getData()));
	}

	private notifyComplete(sessionType: SessionType): void {
		this.onCompleteCallbacks.forEach((cb) => cb(sessionType));
	}

	cleanup(): void {
		this.stop();
		this.onTickCallbacks = [];
		this.onCompleteCallbacks = [];
	}
}