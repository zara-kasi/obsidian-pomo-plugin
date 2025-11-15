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

		// Work session color
		this.createColorPicker(
			containerEl,
			"Work session color",
			"Color for the progress bar during work sessions",
			this.plugin.settings.workColor,
			"var(--interactive-accent)",
			async (value) => {
				this.plugin.settings.workColor = value;
				await this.plugin.saveSettings();
			}
		);

		// Short break color
		this.createColorPicker(
			containerEl,
			"Short break color",
			"Color for the progress bar during short breaks",
			this.plugin.settings.shortBreakColor,
			"var(--interactive-accent)",
			async (value) => {
				this.plugin.settings.shortBreakColor = value;
				await this.plugin.saveSettings();
			}
		);

		// Long break color
		this.createColorPicker(
			containerEl,
			"Long break color",
			"Color for the progress bar during long breaks",
			this.plugin.settings.longBreakColor,
			"var(--interactive-accent)",
			async (value) => {
				this.plugin.settings.longBreakColor = value;
				await this.plugin.saveSettings();
			}
		);

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
	
	private createColorPicker(
	containerEl: HTMLElement,
	name: string,
	desc: string,
	currentValue: string,
	defaultValue: string,
	onChange: (value: string) => Promise<void>
): void {
	const setting = new Setting(containerEl)
		.setName(name)
		.setDesc(desc);

	// Force the entire setting row to be flexbox horizontal layout
	setting.settingEl.style.display = "flex";
	setting.settingEl.style.flexDirection = "row";
	setting.settingEl.style.alignItems = "center";
	setting.settingEl.style.justifyContent = "space-between";

	// Constrain the info section width so it doesn't invade the control area
	const infoEl = setting.settingEl.querySelector('.setting-item-info') as HTMLElement;
	if (infoEl) {
		infoEl.style.flex = "1";
		infoEl.style.maxWidth = "60%";
	}

	// Ensure control area stays on the right
	setting.controlEl.style.flexShrink = "0";
	setting.controlEl.style.display = "flex";
	setting.controlEl.style.alignItems = "center";
	setting.controlEl.style.gap = "8px";

	// Store reference to color preview
	let colorPreview: HTMLDivElement;

	// Add reset button first (so it appears on the left)
	setting.addExtraButton((button) => {
		button
			.setIcon("reset")
			.setTooltip("Reset to default")
			.onClick(async () => {
				colorPreview.style.backgroundColor = defaultValue;
				await onChange("");
			});
	});

	// Create color preview swatch after reset button (so it appears on the right)
	colorPreview = setting.controlEl.createDiv("color-picker-swatch");
	colorPreview.style.width = "40px";
	colorPreview.style.height = "30px";
	colorPreview.style.borderRadius = "8px";
	colorPreview.style.border = "2px solid var(--background-modifier-border)";
	colorPreview.style.cursor = "pointer";
	colorPreview.style.flexShrink = "0";
	
	// Set initial color
	const displayColor = currentValue || defaultValue;
	colorPreview.style.backgroundColor = displayColor;

	// Add click handler to open native color picker
	colorPreview.addEventListener("click", () => {
		const input = document.createElement("input");
		input.type = "color";
		input.value = this.rgbToHex(currentValue) || "#000000";
		
		input.addEventListener("change", async () => {
			const newColor = input.value;
			colorPreview.style.backgroundColor = newColor;
			await onChange(newColor);
		});
		
		input.click();
	});
}

	// Helper function to convert rgb/rgba to hex
	private rgbToHex(color: string): string {
		if (!color || color.startsWith("#")) {
			return color;
		}
		
		// Handle var(--...) CSS variables - return a default
		if (color.startsWith("var(")) {
			return "#000000";
		}

		// Parse rgb/rgba
		const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
		if (match) {
			const r = parseInt(match[1]);
			const g = parseInt(match[2]);
			const b = parseInt(match[3]);
			return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}

		return color;
	}
}