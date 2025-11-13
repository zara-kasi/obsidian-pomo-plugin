import PomodoroPlugin from "../main";
import { VIEW_TYPE_POMODORO, PomodoroView } from "../ui/PomodoroView";

export function registerCommands(plugin: PomodoroPlugin): void {
	// Open Pomodoro view
	plugin.addCommand({
		id: "open-pomodoro-view",
		name: "Open Pomodoro timer",
		callback: () => {
			plugin.activateView();
		},
	});

	// Start timer
	plugin.addCommand({
		id: "start-timer",
		name: "Start timer",
		callback: () => {
			const view = getActiveView(plugin);
			if (view) {
				view.getTimer().start();
			}
		},
	});

	// Pause timer
	plugin.addCommand({
		id: "pause-timer",
		name: "Pause timer",
		callback: () => {
			const view = getActiveView(plugin);
			if (view) {
				view.getTimer().pause();
			}
		},
	});

	// Reset timer
	plugin.addCommand({
		id: "reset-timer",
		name: "Reset timer",
		callback: () => {
			const view = getActiveView(plugin);
			if (view) {
				view.getTimer().reset();
			}
		},
	});

	// Skip session
	plugin.addCommand({
		id: "skip-session",
		name: "Skip to next session",
		callback: () => {
			const view = getActiveView(plugin);
			if (view) {
				view.getTimer().skip();
			}
		},
	});
}

function getActiveView(plugin: PomodoroPlugin): PomodoroView | null {
	const leaves = plugin.app.workspace.getLeavesOfType(VIEW_TYPE_POMODORO);
	if (leaves.length > 0) {
		const view = leaves[0].view;
		if (view instanceof PomodoroView) {
			return view;
		}
	}
	return null;
}