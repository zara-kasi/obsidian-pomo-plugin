# Pomodoro Timer Plugin - File Structure

## Overview

This plugin follows a modular architecture with clear separation of concerns. All source code is organized in the `src/` directory.

## Directory Structure

```
pomodoro-timer/
├── src/
│   ├── main.ts                 # Plugin entry point (minimal)
│   ├── settings.ts             # Settings interface and defaults
│   ├── types.ts                # TypeScript interfaces and enums
│   ├── commands/
│   │   └── index.ts           # Command registration
│   ├── ui/
│   │   ├── PomodoroView.ts    # Main timer widget view
│   │   └── SettingTab.ts      # Settings UI tab
│   └── utils/
│       ├── timer.ts           # Timer logic and state management
│       └── constants.ts       # Constants and helper functions
├── manifest.json              # Plugin metadata
├── styles.css                 # CSS styles for the widget
├── package.json               # Node dependencies
├── tsconfig.json              # TypeScript configuration
├── esbuild.config.mjs         # Build configuration
└── README.md                  # Documentation
```

## File Responsibilities

### Core Files

#### `src/main.ts`
- **Purpose**: Plugin lifecycle management only
- **Responsibilities**:
  - Load/save settings
  - Register views
  - Add ribbon icon
  - Register commands
  - Initialize settings tab
- **Keep it minimal**: All feature logic is delegated to other modules

#### `src/settings.ts`
- **Purpose**: Define plugin settings
- **Exports**:
  - `PomodoroSettings` interface
  - `DEFAULT_SETTINGS` constant
- **Settings include**:
  - Timer durations (work, short break, long break)
  - Automation preferences
  - Notification preferences

#### `src/types.ts`
- **Purpose**: TypeScript type definitions
- **Exports**:
  - `TimerState` enum (IDLE, RUNNING, PAUSED)
  - `SessionType` enum (WORK, SHORT_BREAK, LONG_BREAK)
  - `TimerData` interface

### Commands Module

#### `src/commands/index.ts`
- **Purpose**: Register all plugin commands
- **Commands**:
  - Open Pomodoro view
  - Start/pause/reset timer
  - Skip to next session
- **Pattern**: Commands interact with the PomodoroView to control the timer

### UI Module

#### `src/ui/PomodoroView.ts`
- **Purpose**: Main timer widget display
- **Extends**: `ItemView` from Obsidian API
- **Responsibilities**:
  - Render timer UI
  - Display session type and progress
  - Create control buttons
  - Update UI on timer ticks
  - Handle notifications
- **Key Methods**:
  - `createUI()`: Build the widget structure
  - `updateUI()`: Update display on timer changes
  - `getTimer()`: Expose timer for commands

#### `src/ui/SettingTab.ts`
- **Purpose**: Settings configuration UI
- **Extends**: `PluginSettingTab` from Obsidian API
- **Provides**:
  - Input fields for timer durations
  - Toggle switches for automation
  - Toggle switches for notifications

### Utils Module

#### `src/utils/timer.ts`
- **Purpose**: Core timer logic and state management
- **Class**: `PomodoroTimer`
- **Responsibilities**:
  - Track timer state and time remaining
  - Handle start/pause/reset/skip actions
  - Manage session transitions
  - Emit events on tick and completion
  - Calculate when to take long breaks
- **Key Methods**:
  - `start()`, `pause()`, `reset()`, `skip()`
  - `onTick()`, `onComplete()`: Event subscriptions
  - `getData()`: Get current timer state

#### `src/utils/constants.ts`
- **Purpose**: Shared constants and utilities
- **Exports**:
  - `SESSION_LABELS`: Human-readable session names
  - `SESSION_EMOJIS`: Icons for each session type
  - `formatTime()`: Format seconds as MM:SS

### Build Configuration

#### `esbuild.config.mjs`
- **Purpose**: Bundle TypeScript source into main.js
- **Configuration**:
  - Entry point: `src/main.ts`
  - Output: `main.js`
  - Bundle all imports except Obsidian API
  - Support watch mode for development

#### `tsconfig.json`
- **Purpose**: TypeScript compiler configuration
- **Key settings**:
  - Include all files in `src/`
  - Enable strict type checking
  - Configure module resolution

## Design Patterns

### Separation of Concerns
- **main.ts**: Only plugin lifecycle
- **UI components**: Only rendering and user interaction
- **Utils**: Only business logic
- **Commands**: Only command registration and delegation

### Event-Driven Architecture
- Timer emits events (`onTick`, `onComplete`)
- UI subscribes to timer events
- Decouples timer logic from UI rendering

### Single Responsibility
- Each file has one clear purpose
- Easy to locate and modify specific functionality
- Simplifies testing and maintenance

## Development Workflow

1. **Install dependencies**: `npm install`
2. **Start dev mode**: `npm run dev` (watches for changes)
3. **Make changes** in `src/` directory
4. **Build compiles** TypeScript to `main.js` automatically
5. **Reload Obsidian** to see changes
6. **Production build**: `npm run build` (minified, no sourcemap)

## Adding New Features

### Adding a Command
1. Add command logic in relevant module (e.g., `ui/PomodoroView.ts`)
2. Register command in `src/commands/index.ts`
3. Add to README command list

### Adding a Setting
1. Add property to `PomodoroSettings` in `src/settings.ts`
2. Add default value to `DEFAULT_SETTINGS`
3. Add UI control in `src/ui/SettingTab.ts`
4. Use setting in relevant module

### Adding UI Elements
1. Add HTML structure in `src/ui/PomodoroView.ts`
2. Add styles in `styles.css`
3. Update UI in `updateUI()` method

## Best Practices

- Keep `main.ts` under 100 lines
- Each module file under 300 lines
- Use TypeScript types everywhere
- Comment complex logic
- Follow existing naming conventions
- Test on both desktop and mobile
