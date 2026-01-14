# アイリ Android

[![GitHub](https://img.shields.io/github/license/LemonNekoGH/airi-android)](LICENSE)

A MCP server that allows ~~airi~~ all LLMs to control Android devices. This project is a child project of [airi](https://github.com/moeru-ai/airi).

## Features

### Input Control
- `input_tap` - Tap on the screen at given coordinates
- `input_swipe` - Swipe from one coordinate to another
- `input_text` - Input text on the device
- `input_keyevent` - Send a key event to the device
- `input_press` - Press the current key
- `input_roll` - Roll the trackball

### Device Information
- `wm_size` - Get the physical screen size
- `wm_density` - Get the display density
- `cpu_percent` - Get CPU usage percentage
- `cpu_count` - Get the number of CPU cores
- `battery_level` - Get battery level
- `battery_stats` - Get detailed battery statistics

### UI & Activity
- `ui_get_hierarchy` - Get UI hierarchy (XML)
- `utils_top_activity` - Get the top activity
- `utils_top_activities` - Get all top activities
- `utils_package_version` - Get package version info

### Device Management
- `device_connect` - Connect to a device at specified host and port
- `device_reset` - Reset device connection
- `shell_execute` - Execute any shell command

## Usage

### Docker (Recommended)

```bash
docker run --rm -it -p 3000:3000 -e ADB_HOST=host.docker.internal ghcr.io/proj-airi/airi-android:v0.3.4
# or stdio mode
docker run --rm -i -e USE_STDIO=true -e ADB_HOST=host.docker.internal ghcr.io/proj-airi/airi-android:v0.3.4
```

For agents supporting MCP, you can use the following configuration:

```json5
// mcp.json
{
  "mcpServers": {
    // http mode
    "airi-android-http": {
      "url": "http://localhost:3000"
    },
    // stdio mode
    "airi-android-stdio": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "USE_STDIO=true",
        "-e",
        "ADB_HOST",
        "ghcr.io/proj-airi/airi-android:v0.3.4"
      ],
      "env": {
        "ADB_HOST": "host.docker.internal"
      }
    }
  }
}
```

### Run Directly

Requires [Bun](https://bun.sh/) to be installed.

```bash
# Install dependencies
bun install

# Start server (HTTP mode, port 3000)
bun run start

# Or use stdio mode
USE_STDIO=true bun run start
```

## Development Setup

### Prerequisites

1. Install [Bun](https://bun.sh/)
2. Install [Android Platform Tools](https://developer.android.com/studio/releases/platform-tools)
3. Connect an Android device (via USB or `adb connect` for emulators)

### Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build binary
bun run build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `USE_STDIO` | Set to `true` to use stdio transport mode | `false` |
| `ADB_HOST` | ADB server host address | `localhost` |

## Tech Stack

- [Bun](https://bun.sh/) - JavaScript runtime
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Model Context Protocol SDK
- [adbkit](https://github.com/AnotherGenZ/adbkit) - ADB client library
- [Hono](https://hono.dev/) - Web framework
- [Zod](https://zod.dev/) - Schema validation

## License

[MIT](LICENSE)
