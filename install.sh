#!/bin/bash

set -e

# Get version - default to latest if not provided
VERSION="${1:-latest}"

# Detect platform and arch
PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Normalize architecture names
case "$ARCH" in
  x86_64) ARCH="x64" ;;
  aarch64) ARCH="arm64" ;;
  arm64) ARCH="arm64" ;;
esac

# Map to binary name
case "$PLATFORM-$ARCH" in
  linux-x64) BINARY_NAME="bridge-linux-x64" ;;
  linux-arm64) BINARY_NAME="bridge-linux-arm64" ;;
  darwin-x64) BINARY_NAME="bridge-darwin-x64" ;;
  darwin-arm64) BINARY_NAME="bridge-darwin-arm64" ;;
  *)
    echo "❌ Unsupported platform: $PLATFORM-$ARCH"
    exit 1
    ;;
esac

# Default install location
INSTALL_DIR="${INSTALL_DIR:-.}"

mkdir -p "$INSTALL_DIR"

# Determine GitHub URL
if [ "$VERSION" = "latest" ]; then
  echo "⬇️  Downloading latest bridge binary for $PLATFORM-$ARCH..."
  URL="https://github.com/anthropics-supervised/supervise.dev/releases/latest/download/${BINARY_NAME}"
else
  echo "⬇️  Downloading bridge v${VERSION} for $PLATFORM-$ARCH..."
  URL="https://github.com/anthropics-supervised/supervise.dev/releases/download/bridge-v${VERSION}/${BINARY_NAME}"
fi

BINARY_PATH="$INSTALL_DIR/bridge"

if curl -fsSL -o "$BINARY_PATH" "$URL"; then
  chmod +x "$BINARY_PATH"
  echo "✓ Successfully installed bridge to $BINARY_PATH"
  echo ""
  echo "Usage: $BINARY_PATH"
else
  echo "❌ Failed to download bridge binary"
  exit 1
fi
