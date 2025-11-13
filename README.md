# Pomodoro Timer for Obsidian

A simple and elegant Pomodoro timer plugin for Obsidian that helps you stay focused and productive using the Pomodoro Technique.

## Features

- 🍅 **Classic Pomodoro Timer**: Work sessions, short breaks, and long breaks
- 📊 **Session Tracking**: Keep track of completed Pomodoro sessions
- ⚙️ **Customizable Durations**: Configure work and break durations to your preference
- 🔔 **Notifications**: Get notified when sessions complete
- 🎯 **Sidebar Widget**: Clean, minimal interface in your Obsidian sidebar
- ⌨️ **Keyboard Commands**: Control the timer with commands
- 🌙 **Theme Support**: Works with both light and dark themes
- 📱 **Mobile Compatible**: Works on desktop and mobile devices

## Installation

### From Obsidian Community Plugins (Recommended)

1. Open **Settings** → **Community plugins**
2. Select **Browse** and search for "Pomodoro Timer"
3. Select **Install**, then **Enable**

### Manual Installation

1. Download the latest release from GitHub
2. Extract the files to your vault: `<vault>/.obsidian/plugins/pomodoro-timer/`
3. Reload Obsidian
4. Enable the plugin in **Settings** → **Community plugins**

## Usage

### Opening the Timer

- Click the clock icon in the left ribbon
- Use the command palette: `Pomodoro: Open Pomodoro timer`

### Timer Controls

- **Start**: Begin the current session
- **Pause**: Pause the running timer
- **Reset**: Reset the current session to its full duration
- **Skip**: Skip to the next session (work → break → work)

### Available Commands

Access these via the command palette (Ctrl/Cmd + P):

- `Pomodoro: Open Pomodoro timer`
- `Pomodoro: Start timer`
- `Pomodoro: Pause timer`
- `Pomodoro: Reset timer`
- `Pomodoro: Skip to next session`

## Settings

Configure the plugin in **Settings** → **Pomodoro Timer**:

### Timer Durations

- **Work duration**: Length of work sessions (default: 25 minutes)
- **Short break duration**: Length of short breaks (default: 5 minutes)
- **Long break duration**: Length of long breaks (default: 15 minutes)
- **Sessions until long break**: Number of work sessions before a long break (default: 4)

### Automation

- **Auto-start breaks**: Automatically start break timers after work sessions
- **Auto-start work**: Automatically start work timers after breaks

### Notifications

- **Show notifications**: Display notifications when sessions complete
- **Play sound**: Play a sound when sessions complete

## The Pomodoro Technique

The Pomodoro Technique is a time management method that uses a timer to break work into intervals:

1. Work for 25 minutes (1 Pomodoro)
2. Take a 5-minute short break
3. Repeat steps 1-2
4. After 4 Pomodoros, take a 15-minute long break

This plugin helps you follow this technique while working in Obsidian.

## Development

### Project Structure

```
src/
  main.ts              # Plugin entry point
  settings.ts          # Settings interface and defaults
  types.ts             # TypeScript type definitions
  commands/
    index.ts           # Command registration
  ui/
    PomodoroView.ts    # Main timer view
    SettingTab.ts      # Settings UI
  utils/
    timer.ts           # Timer logic
    constants.ts       # Constants and helpers
```

### Building

```bash
npm install
npm run dev    # Development mode with watch
npm run build  # Production build
```

### Testing

Copy the built files to your vault's plugins folder:

```bash
cp main.js manifest.json styles.css <vault>/.obsidian/plugins/pomodoro-timer/
```

## Support

If you find this plugin helpful, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs or suggesting features
- 💬 Sharing your experience with others

## License

MIT License - See LICENSE file for details

## Credits

Inspired by the Pomodoro Technique developed by Francesco Cirillo and the clean design of Liam Cain's Calendar plugin.