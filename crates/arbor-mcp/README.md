# Arbor MCP Server

The **Model Context Protocol (MCP)** implementation for Arbor.

This crate allows AI assistants (like Claude Desktop) to connect directly to the Arbor graph to query code context, understand dependencies, and navigate the "Logic Forest" of your codebase.

## Features

- **Context Tools**: `get_logic_context`, `analyze_impact`
- **Architectural Brief**: Returns context as structured Markdown tables
- **Spotlight Protocol**: Triggers visual feedback in VS Code and the Arbor Visualizer when the AI focuses on a node.

## Usage

This crate is typically run via the `arbor-cli`:

```bash
arbor bridge
```

But it can be used as a library to embed Arbor capability into other Rust MCP servers.

## Documentation

For full documentation, see the [main repository](https://github.com/Anandb71/arbor).
