import { Plugin } from "obsidian";
import { PomodoroSettings, DEFAULT_SETTINGS } from "./settings";
import { registerCommands } from "./commands";
import { PomodoroView, VIEW_TYPE_POMODORO } from "./ui/PomodoroView";
import { PomodoroSettingTab } from "./ui/SettingTab";

export default class PomodoroPlugin extends Plugin {
	settings: PomodoroSettings;

	async onload() {
		await this.loadSettings();

		// Register the Pomodoro view
		this.registerView(
			VIEW_TYPE_POMODORO,
			(leaf) => new PomodoroView(leaf, this)
		);


		// Register all commands
		registerCommands(this);

		// Add settings tab
		this.addSettingTab(new PomodoroSettingTab(this.app, this));

		// Automatically activate view in sidebar on plugin load
		this.app.workspace.onLayoutReady(() => {
			this.activateView().then(() => {
				// If auto-start is enabled, start the timer
				if (this.settings.autoStartOnLoad) {
					const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_POMODORO);
					if (leaves.length > 0) {
						const view = leaves[0].view;
						if (view instanceof PomodoroView) {
							view.getTimer().start();
						}
					}
				}
			});
		});
	}

	async onunload() {
		// Clean up views
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_POMODORO);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf = workspace.getLeavesOfType(VIEW_TYPE_POMODORO)[0];

		if (!leaf) {
			const newLeaf = workspace.getRightLeaf(false);
			if (newLeaf) {
				leaf = newLeaf;
				await leaf.setViewState({
					type: VIEW_TYPE_POMODORO,
					active: true,
				});
			}
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}
}