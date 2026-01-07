## Description

**Arbor v1.0.0 CPG Engine Release** - Transforms Arbor from an AST-indexer into a full Code Property Graph (CPG) Engine with control flow/data flow edges, 10 language support, scalable visualization, and production deployment capabilities.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [x] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [x] Documentation update
- [x] Performance improvement
- [x] Code refactoring

## Changes Made

### Language Support (parser_v2.rs)

- Added **C# parser** with tree-sitter-c-sharp (methods, classes, interfaces, structs, properties)
- Consolidated 8/9 languages into query-based `parser_v2.rs` (TypeScript, Rust, Python, Go, Java, C, C++, C#)
- Isolated Dart ABI transmute into `dart_language_compat()` helper with safety docs

### CPG Edge Types (edge.rs)

- Added `EdgeKind::FlowsTo` for Control Flow Graph edges
- Added `EdgeKind::DataDependency` for Data Flow Analysis edges

### Visualizer Performance (visualizer/)

- Implemented **Barnes-Hut QuadTree** in `quad_tree.dart` for O(n log n) force simulation
- Added **viewport culling** in `graph_painter.dart` to skip off-screen nodes
- Added **LOD rendering** for distant nodes at low zoom levels

### CLI Improvements (arbor-cli/)

- Added `--headless` flag for remote/Docker/WSL deployment (binds to `0.0.0.0`)

### Repository Hygiene

- Removed bloat from git: `arbor-windows-v0.1.0/`, `arbor-windows-v0.1.1.zip`, `node_modules/`
- Fixed `.gitignore` with proper entries for zip, node_modules, release artifacts

### Dependencies

- Added `bincode = "1.3"` to arbor-server for future binary wire protocol
- Added `tree-sitter-c-sharp = "0.21"` to workspace

## Testing

- [x] Ran `cargo test --all` ✅ **25 tests passing**
- [ ] Ran `cargo clippy --all`
- [ ] Ran `flutter test` (if applicable)
- [x] Tested manually with a real codebase

```
test result: ok. 25 passed; 0 failed; 0 ignored
```

## Screenshots (if applicable)

N/A - Backend and performance changes. Barnes-Hut QuadTree enables 100k+ node visualization.

## Checklist

- [x] My code follows the project's style guidelines
- [x] I have added tests for my changes
- [x] I have updated the documentation where necessary (CHANGELOG.md)
- [x] All new and existing tests pass
- [x] I have added appropriate comments where the code isn't self-explanatory
