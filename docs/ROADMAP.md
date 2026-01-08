# Arbor v1.1.0 Roadmap: "The Sentinel Update"

## Overview

v1.1.0 transforms Arbor from a passive indexer into an **active guardian** for AI-assisted development.

---

## Core Features

### 1. 🎯 Impact Radius Simulator

**Goal**: Predict breakage before code changes.

| Component | Tech | File |
|-----------|------|------|
| Reachability Analysis | BFS/DFS from target node | `arbor-graph/src/impact.rs` |
| MCP Tool | `analyze_impact(node, depth)` | `arbor-mcp/src/lib.rs` |
| Visualizer | Red glow on affected nodes | `visualizer/lib/graph/` |

**API**:

```json
{ "tool": "analyze_impact", "args": { "node": "auth::validate", "depth": 3 } }
```

**Returns**: List of affected nodes + severity (direct/transitive).

**Refinement (Blast Shield)**: Use a heat gradient instead of binary red glow:

- Direct modifications → Bright red
- 1-hop dependencies → Orange
- 2+ hops → Yellow (fading with distance)

---

### 2. ✂️ Dynamic Context Slicing

**Goal**: Send only relevant code to LLMs.

| Component | Tech | File |
|-----------|------|------|
| Lineage Extraction | Ancestor + Descendant traversal | `arbor-graph/src/slice.rs` |
| Token Estimator | Approximate token count | `arbor-core/src/tokens.rs` |
| Pruning Strategy | Configurable depth limits | Config |

**API**:

```json
{ "tool": "get_context", "args": { "node": "api::handler", "max_tokens": 4000 } }
```

**Refinement (Pinning)**: Allow users to "pin" core nodes (e.g., `auth`, `config`) so they persist in context even when slicing deep into sub-modules.

---

### 3. 🔀 Shadow Indexing (Structural Diffs)

**Goal**: AST-level git diffs.

| Component | Tech | File |
|-----------|------|------|
| Git Integration | `git2` crate | `arbor-core/src/git.rs` |
| Graph Diffing | Compare node sets | `arbor-graph/src/diff.rs` |
| PR Generator | Markdown summary | `arbor-cli/src/commands/diff.rs` |

**CLI**:

```bash
arbor diff HEAD~1..HEAD --format=markdown
arbor diff HEAD~1..HEAD --structural-only  # Ignore formatting/comments
```

**Refinement (`--structural-only`)**: Only report when the *logic graph* changes, ignoring whitespace, comments, and formatting.

---

### 4. 🔥 Technical Debt Heatmaps

**Goal**: Visualize code health.

| Metric | Calculation | Visual |
|--------|-------------|--------|
| Cyclomatic Complexity | Count decision points in AST | Node size |
| Coupling (Fan-In) | Count incoming edges | Red glow intensity |
| Cohesion | Internal vs external calls | Border thickness |

**Visualizer Update**: Add heatmap toggle in toolbar.

---

### 5. 👥 Arbor Relay (Collaborative Sessions)

**Goal**: Real-time shared visualization.

| Component | Tech | File |
|-----------|------|------|
| Session Manager | UUID-based rooms | `arbor-server/src/relay.rs` |
| Cursor Sync | Broadcast mouse position | WebSocket |
| Presence | User avatars on nodes | Visualizer |

**Flow**:

```
arbor relay --create  →  Share code: ARBOR-XYZ
arbor relay --join ARBOR-XYZ
```

---

## Distribution

### 6. 🐳 Docker Distribution

**Goal**: One-command installation.

```dockerfile
FROM rust:1.75-slim AS builder
WORKDIR /app
COPY . .
RUN cargo build --release -p arbor-graph-cli

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/arbor /usr/local/bin/
ENTRYPOINT ["arbor"]
```

**Usage**:

```bash
docker pull ghcr.io/anandb71/arbor:1.1.0
docker run -v $(pwd):/workspace ghcr.io/anandb71/arbor index
```

**Windows**: Docker Desktop + WSL2 integration.

**Refinement (File Watchers)**: Use `virtiofs` mounts where possible. Add a polling fallback in `arbor-watcher` config for Docker volumes where `notify` is unreliable.

---

### 7. 🍎 Cross-Platform Binaries (GitHub Actions)

**Goal**: Pre-built binaries for all major platforms.

| Target | Architecture | Artifact |
|--------|--------------|----------|
| macOS | Intel (x86_64) | `arbor-macos-intel-v1.1.0.zip` |
| macOS | Apple Silicon (aarch64) | `arbor-macos-arm64-v1.1.0.zip` |
| Linux | x86_64 | `arbor-linux-x64-v1.1.0.tar.gz` |
| Linux | ARM64 | `arbor-linux-arm64-v1.1.0.tar.gz` |
| Windows | x86_64 | `arbor-windows-v1.1.0.zip` |

**CI Workflow**: `.github/workflows/release.yml`

- Triggered on git tag `v*`
- Uses `cross` for cross-compilation
- Auto-uploads to GitHub Releases

---

## Creative Additions

### 8. 🧪 "What-If" Sandbox

Simulate refactors without touching files.

- Clone graph in memory
- Apply hypothetical changes
- Re-run impact analysis

### 9. 📊 Weekly Health Reports

Scheduled CLI job that generates:

- Complexity trends over time
- New coupling introduced
- Orphan nodes (dead code candidates)

### 10. 🔌 LSP Integration

Language Server Protocol for IDE features:

- Hover: Show node connections
- CodeLens: "5 callers | 3 dependencies"
- Go to Definition: Graph-aware navigation

### 11. 🎮 "Archipelago Mode" (Visualizer)

Hide low-connectivity nodes to reveal architecture:

- Filter by edge count threshold
- Show only "islands" of high activity
- Animate cluster formation

---

## Adoption & UX (Critical for Growth)

### 12. 🚀 Opinionated Workflows

**Problem**: Arbor can do many things, but nothing screams "I need this now."

**Solution**: Two killer default workflows as first-class CLI commands:

#### Safe Refactor Mode

```bash
arbor refactor auth.rs::validate_token
# Output:
# ⚠️  Blast Radius: 12 nodes affected
# ├── Direct: TokenMiddleware, AuthController
# ├── Transitive: UserService, SessionManager, ...
# └── Public API impact: 2 endpoints
# 
# Proceed with refactor? [y/N]
```

#### Explain Codebase Mode

```bash
arbor explain "Where does authentication start?"
# Output:
# Path traced: AuthController → TokenMiddleware → UserRepository → DB
# Context: 2,400 tokens (within limit)
# Confidence: Graph-backed (not RAG)
```

---

### 13. 🎯 Flagship Language Depth (TypeScript)

**Problem**: Language breadth > depth. Shallow semantics everywhere.

**Solution**: Pick ONE language and make it **scary-good**.

| Target | TypeScript |
|--------|------------|
| Async/await edges | Trace Promise chains |
| Type inference | Resolve generics properly |
| Module resolution | Handle barrel exports, path aliases |
| React component tree | Parent → Child props flow |

**Why TypeScript?** Largest user base, most AI coding assistants target JS/TS.

---

### 14. 📹 AI Transcript Demos

**Problem**: AI value is implicit, not obvious.

**Solution**: Add before/after transcripts showing how LLMs behave differently with Arbor.

**Location**: `docs/demos/` directory with:

- `WITHOUT_ARBOR.md` — LLM hallucinates, misses dependencies
- `WITH_ARBOR.md` — LLM walks graph, correct answer

**README Section**: Link to these prominently under "Why Arbor?"

---

### 15. 📖 ArborQL Documentation

**Problem**: ArborQL is undersold. Appears late and briefly.

**Solution**: Dedicated `docs/ARBORQL.md` with:

- Full query syntax reference
- Pathfinding examples (not just search)
- Traversal vs Search explanation
- Integration with MCP tools

---

### 16. 👋 Contributor Onboarding

**Problem**: High friction for new contributors (Rust + Tree-sitter + graph theory).

**Solution**:

1. **Good First Issues template** in `docs/GOOD_FIRST_ISSUES.md`
2. **"Add a language edge"** tutorial
3. **"Add a query"** tutorial  
4. **Architecture decision records** (ADRs) in `docs/adr/`

---

## Implementation Order

| Phase | Features | Est. Effort |
|-------|----------|-------------|
| **Phase 1** | Impact Radius, Context Slicing | 2 weeks |
| **Phase 2** | Shadow Indexing, Heatmaps | 2 weeks |
| **Phase 3** | Docker, Cross-Platform CI | 1 week |
| **Phase 4** | Creative (Sandbox, Reports, LSP) | 3 weeks |
| **Phase 5** | Adoption (Workflows, TS Depth, Demos) | 2 weeks |

---

## Next Steps

- [ ] Create `feature/v1.1.0` branch
- [ ] Implement `impact.rs` reachability
- [ ] Update CHANGELOG with v1.1.0 section
- [ ] Design Docker CI/CD pipeline
- [ ] Write ArborQL documentation
- [ ] Create AI transcript demos
- [ ] Improve GOOD_FIRST_ISSUES.md
