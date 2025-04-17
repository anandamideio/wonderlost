# Wonderlost

![Foundry v12](https://img.shields.io/badge/Foundry-v12-informational)

A modular Foundry VTT library providing enhanced interface features to support the Wondershade system in PF2e. Wonderlost is designed with a flexible, modular architecture that allows for easy extension and customization.

## Architecture

Wonderlost is built around a central concept called **Tomes**. Each Tome is a self-contained module that provides specific functionality:

```txt
Wonderlost
├── Core
│   ├── Tome.ts (base class)
│   └── WonderErrors.ts
└── Submodules
    ├── Toasted (chat notifications)
    └── Narrator (storytelling tools)
```

### Core Concepts

- **Tome**: The base class for all sub-modules, providing standardized methods for:
  - Settings management
  - Hook registration
  - Socket communication
  - Stylesheet loading
  - Debugging support

## Submodules

### Toasted

Toasted provides elegant toast notifications for chat messages, making it easier to keep track of what's happening without keeping the chat log open.

#### Features

- **Position Control**: Place notifications in any of 9 positions on screen (upper/middle/lower × left/center/right)
- **Customizable Duration**: Set how long notifications remain visible (1-10 seconds)
- **Message Limit**: Control maximum number of messages displayed simultaneously (1-10)
- **Interactive**: Click on notifications to interact with the original chat message
- **Smart Behavior**: Option to show notifications even when chat is already open

#### Configuration

Toasted provides user-configurable settings through the module settings panel:

| Setting | Description |
|---------|-------------|
| Toast Duration | How long messages remain visible (1000-10000ms) |
| Max Messages | Maximum number of simultaneous toast messages (1-10) |
| Always Show Notifications | Display toasts even when chat panel is open |
| Toast Position | Where on screen toasts appear |

### Narrator

A powerful tool for GMs to enhance storytelling with stylized text and visual effects.

#### Features

- Custom fonts for thematic text displays
- Scene-setting tools
- NPC dialog formatting
- And more!

## Installation

1. In Foundry VTT, navigate to the Add-on Modules tab
2. Click "Install Module"
3. Search for "Wonderlost" or paste the manifest URL: `https://github.com/anandamideio/wonderlost/releases/latest/download/module.json`
4. Click "Install"

## Usage

After installation, Wonderlost and its submodules will be automatically initialized. Each submodule can be configured through the module settings panel in Foundry VTT.

### Development

If you're interested in extending Wonderlost with your own Tomes, the base architecture makes it straightforward:

```typescript
export class MyCustomTome extends Tome {
  constructor(DEBUG = false) {
    super({
      moduleName: 'MyCustomTome',
      moduleDescription: 'My custom functionality',
      hooks: new Map([
        // Your hooks here
      ]),
      settings: {
        // Your settings here
      },
      DEBUG,
    });
  }
  
  // Your custom methods here
}
```

## License

MIT License

## Credits

- Created by Antonio B.
- Special thanks to the Foundry VTT community

---

*Wonderlost is not affiliated with Paizo Inc. or the Pathfinder 2e game system.*
