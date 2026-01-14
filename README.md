# アイリ Android

A MCP server to allow ~~airi~~ LLM to use Android Device. This project is child project of [airi](https://github.com/moeru-ai/airi).

## Usage

With Docker:

```json5
// mcp.json
{
  "mcpServers": {
    "airi-android": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "--init",
        "-i",
        "-e",
        "ADB_HOST",
        "ghcr.io/lemonnekogh/airi-android:v0.2.1"
      ],
      "env": {
        "ADB_HOST": "host.docker.internal"
      }
    }
  }
}
```

## Setup development environment

### Package manager

1. Install `bun` [here](https://bun.sh/).
2. Install dependencies.

    ```bash
    bun install
    ```

### ADB connection

1. Install platform-tools from [here](https://developer.android.com/studio/releases/platform-tools).
2. Connect your Android device via USB, or use the AVD (Android Virtual Device) via `adb connect`.

### Start the server

Run the mcp inspector it will start the server.

```bash
bun run src/main.ts
```
