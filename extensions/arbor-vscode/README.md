# Arbor VS Code Extension

Connects VS Code to the Arbor Logic Forest for AI-aware code navigation.

## Features

| Feature | Description |
|---------|-------------|
| **Spotlight Sync** | When AI queries a node via MCP, the corresponding line is highlighted |
| **Show in Visualizer** | Right-click → "Show in Arbor Visualizer" |
| **Toggle Visualizer** | `Ctrl+Shift+A` / `Cmd+Shift+A` launches `arbor viz` |
| **Status Bar** | Connection indicator (click to reconnect) |

## Golden Highlight System

When the AI focuses on a code symbol, the extension highlights the corresponding line with:

- **Background**: `rgba(255, 215, 0, 0.15)` (15% opacity gold)
- **Border**: `1px solid rgba(255, 215, 0, 0.5)`
- **Ruler**: Gold indicator in the overview ruler
- **Duration**: 3 seconds auto-fadeout

## Development

```bash
cd extensions/arbor-vscode
npm install
npm run compile
```

Then press F5 in VS Code to launch the extension in debug mode.

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `arbor.serverUrl` | `ws://127.0.0.1:8080` | WebSocket URL for Arbor server |

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| `arbor.connect` | - | Connect to Arbor server |
| `arbor.showInVisualizer` | - | Focus current line in visualizer |
| `arbor.toggleVisualizer` | `Ctrl+Shift+A` | Launch `arbor viz` in terminal |
