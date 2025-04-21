# Wonderlost

![Foundry v12](https://img.shields.io/badge/Foundry-v12-informational)

Wonderlost is a modular enhancement suite for Foundry VTT that improves your gaming experience with features like toast notifications for chat messages and powerful storytelling tools for Game Masters.

## Features

### Modular Architecture

Wonderlost is built around a powerful concept called **Tomes** - self-contained modules that provide specific functionality while sharing a common framework:

- **Plug-and-Play Design**: Enable or disable modules as needed
- **Consistent Interface**: All modules follow the same pattern for settings and configuration
- **Extensible System**: Create your own Tomes with minimal boilerplate code

### Current Modules

#### Toasted

Toasted provides toast notifications for chat messages, making it easier to keep track of what's happening without keeping the chat log open.

- **Position Control**: 9 customizable positions on screen
- **Appearance Settings**: Customize duration, quantity, and behavior
- **Interactive**: Click notifications to jump to the original message
- **Unobtrusive**: Perfect for keeping track of rolls and messages

#### Narrator

Enhanced storytelling tools that help GMs create immersive narrative experiences.

- **Custom Fonts**: Apply thematic text styling to create mood
- **Scene-Setting Tools**: Create atmospheric descriptions
- **NPC Dialog Formatting**: Distinguished text styles for different characters
- **Visual Effects**: Add emphasis to important moments

## Installation

### Requirements

- Foundry VTT v12 or newer
- Required modules:
  - [lib-wrapper](https://github.com/ruipin/fvtt-lib-wrapper)
  - [socketlib](https://github.com/manuelVo/foundryvtt-socketlib)

### Installation Methods

#### Method 1: Foundry Package Browser

1. Open Foundry VTT
2. Navigate to the "Add-on Modules" tab
3. Click "Install Module"
4. Search for "Wonderlost" and click Install

#### Method 2: Manual Installation

1. Copy the manifest URL: `https://github.com/anandamideio/wonderlost/releases/latest/download/module.json`
2. Open Foundry VTT
3. Navigate to the "Add-on Modules" tab
4. Click "Install Module"
5. Paste the manifest URL in the "Manifest URL" field
6. Click "Install"

## Configuration

Each module can be configured through the module settings panel in Foundry VTT:

1. Go to "Game Settings"
2. Click "Configure Settings"
3. Navigate to the "Wonderlost" section
4. Configure individual modules as desired

## Developer Documentation

### Creating Your Own Tome

Wonderlost's architecture makes it easy to create your own modules:

```typescript
// MyCustomTome.ts
import { Tome } from 'wonderlost';

export class MyCustomTome extends Tome {
  constructor(DEBUG = false) {
    super({
      moduleName: 'MyCustomTome',
      moduleDescription: 'My custom functionality',
      hooks: [
        ['renderChatLog', (app, html) => {
          // Your hook implementation
        }],
        ['ready', () => {
          // Setup on Foundry ready
        }]
      ],
      settings: {
        globalSettings: [{
          name: 'mySetting',
          hint: 'A custom setting',
          type: String,
          defaultValue: 'default',
          choices: {
            'default': 'Default Option',
            'alternate': 'Alternate Option'
          },
          onChange: (value) => {
            // Handle setting change
          }
        }]
      },
      DEBUG
    });
  }
  
  // Your custom methods
}
```

## License

MIT License

## Credits

- Created by Antonio B.
- Special thanks to the Foundry VTT community

---

*Wonderlost is not affiliated with Paizo Inc. or the Pathfinder 2e game system.*
