# Arbor CLI

The command-line interface for **Arbor**, the graph-native intelligence layer for code.

This tool indexes your codebase into a queryable graph and acts as the "nervous system" connecting your code, AI agents, and IDE.

## Installation

```bash
cargo install arbor-cli
```

## Usage

Initialize a new project:

```bash
cd your-project
arbor init
```

Index the codebase:

```bash
arbor index
```

Start the context server (MCP & WebSocket):

```bash
arbor serve
```

Run the Agentic Bridge with Visualizer:

```bash
arbor bridge --viz
```

## Documentation

For full documentation, see the [main repository](https://github.com/Anandb71/arbor).
