import { App, PluginSettingTab, Setting } from "obsidian";
import PomodoroPlugin from "../main";

export class PomodoroSettingTab extends PluginSettingTab {
	plugin: PomodoroPlugin;

	constructor(app: App, plugin: PomodoroPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// ==================== GENERAL SETTINGS ====================
		containerEl.createEl("h2", { text: "General Settings" });

		// --- Time Durations ---
		containerEl.createEl("h3", { text: "Time durations" });

		new Setting(containerEl)
			.setName("Work duration")
			.setDesc("Duration of work sessions in minutes")
			.addText((text) =>
				text
					.setPlaceholder("25")
					.setValue(String(this.plugin.settings.workDuration))
					.onChange(async (value) => {
						const num = Number(value);
						if (!isNaN(num) && num > 0) {
							this.plugin.settings.workDuration = num;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("Short break duration")
			.setDesc("Duration of short breaks in minutes")
			.addText((text) =>
				text
					.setPlaceholder("5")
					.setValue(String(this.plugin.settings.shortBreakDuration))
					.onChange(async (value) => {
						const num = Number(value);
						if (!isNaN(num) && num > 0) {
							this.plugin.settings.shortBreakDuration = num;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("Long break duration")
			.setDesc("Duration of long breaks in minutes")
			.addText((text) =>
				text
					.setPlaceholder("15")
					.setValue(String(this.plugin.settings.longBreakDuration))
					.onChange(async (value) => {
						const num = Number(value);
						if (!isNaN(num) && num > 0) {
							this.plugin.settings.longBreakDuration = num;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("Sessions until long break")
			.setDesc("Number of work sessions before a long break")
			.addText((text) =>
				text
					.setPlaceholder("4")
					.setValue(String(this.plugin.settings.sessionsUntilLongBreak))
					.onChange(async (value) => {
						const num = Number(value);
						if (!isNaN(num) && num > 0) {
							this.plugin.settings.sessionsUntilLongBreak = num;
							await this.plugin.saveSettings();
						}
					})
			);

		// --- Automation ---
		containerEl.createEl("h3", { text: "Automation" });

		new Setting(containerEl)
			.setName("Auto-start timer on load")
			.setDesc("Automatically start the timer when the plugin loads or Obsidian starts")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoStartOnLoad)
					.onChange(async (value) => {
						this.plugin.settings.autoStartOnLoad = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Auto-start breaks")
			.setDesc("Automatically start break timers after work sessions")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoStartBreaks)
					.onChange(async (value) => {
						this.plugin.settings.autoStartBreaks = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Auto-start work")
			.setDesc("Automatically start work timers after breaks")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoStartWork)
					.onChange(async (value) => {
						this.plugin.settings.autoStartWork = value;
						await this.plugin.saveSettings();
					})
			);

		// --- Notifications ---
		containerEl.createEl("h3", { text: "Notifications" });

		new Setting(containerEl)
			.setName("Show notifications")
			.setDesc("Display notifications when sessions complete")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showNotifications)
					.onChange(async (value) => {
						this.plugin.settings.showNotifications = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Play sound")
			.setDesc("Play a sound when sessions complete")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.playSound)
					.onChange(async (value) => {
						this.plugin.settings.playSound = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Play vibration")
			.setDesc("Vibrate when sessions complete (if supported by device)")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.playVibration)
					.onChange(async (value) => {
						this.plugin.settings.playVibration = value;
						await this.plugin.saveSettings();
					})
			);

		// ==================== CUSTOMIZATION ====================
		containerEl.createEl("h2", { text: "Customization" });

		// --- Progress Bar Colors ---
		containerEl.createEl("h3", { text: "Progress bar colors" });

		new Setting(containerEl)
			.setName("Work session color")
			.setDesc("Color for the progress bar during work sessions (leave empty for Obsidian accent color)")
			.addText((text) => {
				text
					.setPlaceholder("#e74c3c or leave empty")
					.setValue(this.plugin.settings.workColor)
					.onChange(async (value) => {
						this.plugin.settings.workColor = value.trim();
						await this.plugin.saveSettings();
					});
				text.inputEl.setAttribute("type", "text");
			})
			.addExtraButton((button) => {
				button
					.setIcon("palette")
					.setTooltip("Pick color")
					.onClick(() => {
						const input = document.createElement("input");
						input.type = "color";
						input.value = this.plugin.settings.workColor || "#e74c3c";
						input.addEventListener("change", async () => {
							this.plugin.settings.workColor = input.value;
							await this.plugin.saveSettings();
							this.display();
						});
						input.click();
					});
			});

		new Setting(containerEl)
			.setName("Short break color")
			.setDesc("Color for the progress bar during short breaks (leave empty for Obsidian accent color)")
			.addText((text) => {
				text
					.setPlaceholder("#3498db or leave empty")
					.setValue(this.plugin.settings.shortBreakColor)
					.onChange(async (value) => {
						this.plugin.settings.shortBreakColor = value.trim();
						await this.plugin.saveSettings();
					});
				text.inputEl.setAttribute("type", "text");
			})
			.addExtraButton((button) => {
				button
					.setIcon("palette")
					.setTooltip("Pick color")
					.onClick(() => {
						const input = document.createElement("input");
						input.type = "color";
						input.value = this.plugin.settings.shortBreakColor || "#3498db";
						input.addEventListener("change", async () => {
							this.plugin.settings.shortBreakColor = input.value;
							await this.plugin.saveSettings();
							this.display();
						});
						input.click();
					});
			});

		new Setting(containerEl)
			.setName("Long break color")
			.setDesc("Color for the progress bar during long breaks (leave empty for Obsidian accent color)")
			.addText((text) => {
				text
					.setPlaceholder("#2ecc71 or leave empty")
					.setValue(this.plugin.settings.longBreakColor)
					.onChange(async (value) => {
						this.plugin.settings.longBreakColor = value.trim();
						await this.plugin.saveSettings();
					});
				text.inputEl.setAttribute("type", "text");
			})
			.addExtraButton((button) => {
				button
					.setIcon("palette")
					.setTooltip("Pick color")
					.onClick(() => {
						const input = document.createElement("input");
						input.type = "color";
						input.value = this.plugin.settings.longBreakColor || "#2ecc71";
						input.addEventListener("change", async () => {
							this.plugin.settings.longBreakColor = input.value;
							await this.plugin.saveSettings();
							this.display();
						});
						input.click();
					});
			});

		// --- Custom Notification Messages ---
		containerEl.createEl("h3", { text: "Custom notification messages" });

		new Setting(containerEl)
			.setName("Work session complete title")
			.setDesc("Title for the notification when a work session ends")
			.addText((text) =>
				text
					.setPlaceholder("Work Session Complete")
					.setValue(this.plugin.settings.workCompleteTitle)
					.onChange(async (value) => {
						this.plugin.settings.workCompleteTitle = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Work session complete message")
			.setDesc("Message for the notification when a work session ends")
			.addTextArea((text) => {
				text
					.setPlaceholder("Great job! Time for a break.")
					.setValue(this.plugin.settings.workCompleteMessage)
					.onChange(async (value) => {
						this.plugin.settings.workCompleteMessage = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 2;
				text.inputEl.cols = 40;
			});

		new Setting(containerEl)
			.setName("Short break complete title")
			.setDesc("Title for the notification when a short break ends")
			.addText((text) =>
				text
					.setPlaceholder("Short Break Complete")
					.setValue(this.plugin.settings.shortBreakCompleteTitle)
					.onChange(async (value) => {
						this.plugin.settings.shortBreakCompleteTitle = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Short break complete message")
			.setDesc("Message for the notification when a short break ends")
			.addTextArea((text) => {
				text
					.setPlaceholder("Break's over! Ready to focus?")
					.setValue(this.plugin.settings.shortBreakCompleteMessage)
					.onChange(async (value) => {
						this.plugin.settings.shortBreakCompleteMessage = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 2;
				text.inputEl.cols = 40;
			});

		new Setting(containerEl)
			.setName("Long break complete title")
			.setDesc("Title for the notification when a long break ends")
			.addText((text) =>
				text
					.setPlaceholder("Long Break Complete")
					.setValue(this.plugin.settings.longBreakCompleteTitle)
					.onChange(async (value) => {
						this.plugin.settings.longBreakCompleteTitle = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Long break complete message")
			.setDesc("Message for the notification when a long break ends")
			.addTextArea((text) => {
				text
					.setPlaceholder("Refreshed and ready! Let's get back to work.")
					.setValue(this.plugin.settings.longBreakCompleteMessage)
					.onChange(async (value) => {
						this.plugin.settings.longBreakCompleteMessage = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.rows = 2;
				text.inputEl.cols = 40;
			});
	}
}