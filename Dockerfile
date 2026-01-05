# Stage 1: Build
FROM rust:1.75-slim as builder
WORKDIR /app
COPY crates/ ./crates/
COPY Cargo.toml ./Cargo.toml
WORKDIR /app/crates
RUN cargo build --release

# Stage 2: Runtime
FROM debian:bookworm-slim
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/crates/target/release/arbor /usr/local/bin/arbor

# The inspector needs to talk to the server via stdio
ENTRYPOINT ["arbor"]
CMD ["bridge"]
