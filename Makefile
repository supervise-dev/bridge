.PHONY: help build build-all build-linux-x64 build-linux-arm64 build-darwin-x64 build-darwin-arm64 build-client dev-server install clean

SHELL := /bin/bash
DIST_DIR := dist
VERSION := $(shell node -e "console.log(require('./package.json').version)")
GITHUB_REPO := supervise-dev/api.supervise.dev

help:
	@echo "Bridge Build Targets"
	@echo "===================="
	@echo ""
	@echo "Build Commands:"
	@echo "  make build                 - Build client library and native bridge binary"
	@echo "  make build-all             - Build all architecture binaries"
	@echo "  make build-client          - Build TypeScript client library only"
	@echo "  make build-linux-x64       - Build Linux x64 binary"
	@echo "  make build-linux-arm64     - Build Linux ARM64 binary"
	@echo "  make build-darwin-x64      - Build macOS x64 binary"
	@echo "  make build-darwin-arm64    - Build macOS ARM64 binary"
	@echo ""
	@echo "Development:"
	@echo "  make dev-server            - Run development server with watch"
	@echo "  make clean                 - Remove build artifacts"
	@echo ""
	@echo "Distribution:"
	@echo "  make install               - Download and install latest binary for current platform"
	@echo "  make install-v<VERSION>    - Download and install specific version"
	@echo ""

# Default build target
build: build-client build-bridge
	@echo "✓ Build complete"

# Build all binaries
build-all: build-client build-linux-x64 build-linux-arm64 build-darwin-x64 build-darwin-arm64
	@echo "✓ All binaries built successfully"

# Build client library
build-client:
	@echo "Building client library..."
	@pnpm run build:client

# Build default bridge binary (current platform)
build-bridge:
	@echo "Building bridge binary..."
	@pnpm run build:bridge

# Architecture-specific builds
build-linux-x64:
	@echo "Building Linux x64..."
	@pnpm run build:bridge:linux-x64

build-linux-arm64:
	@echo "Building Linux ARM64..."
	@pnpm run build:bridge:linux-arm64

build-darwin-x64:
	@echo "Building macOS x64..."
	@pnpm run build:bridge:darwin-x64

build-darwin-arm64:
	@echo "Building macOS ARM64..."
	@pnpm run build:bridge:darwin-arm64

# Cleanup
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(DIST_DIR)
	@echo "✓ Clean complete"

# Release helpers
release-version:
	@echo "Bridge v$(VERSION)"

release-tag:
	@echo "bridge-v$(VERSION)"

# Show platform info
platform-info:
	@echo "Platform: $$(uname -s)"
	@echo "Architecture: $$(uname -m)"
	@echo "Node version: $$(node --version)"
	@echo "Bun version: $$(bun --version)"
