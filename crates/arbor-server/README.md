# Arbor Server

The WebSocket server component of **Arbor**.

It exposes the Arbor graph via a JSON-RPC 2.0 interface, allowing IDE extensions, visualization tools, and other clients to query the code graph in real-time.

## Protocol

The server runs on `ws://localhost:7432` by default.

Supported methods:

- `discover`: Find architectural roots
- `impact`: Calculate blast radius of changes
- `context`: Retrieve ranked context for AI
- `graph.subscribe`: Subscribe to live graph updates

## Usage

This crate is typically run via the `arbor-cli`:

```bash
arbor serve
```

## Documentation

For full documentation, see the [main repository](https://github.com/Anandb71/arbor).
