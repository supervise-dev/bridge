# Bridge

A high-performance, type-safe tRPC bridge for remote filesystem and process operations. Built with Bun for fast execution and distributed as compiled binaries for easy deployment.

## Features

### Filesystem Operations
- `exists` - Check if file/directory exists
- `mkdir` - Create directories (with recursive option)
- `readdir` - Read directory contents (with file type information)
- `readFile` - Read files (text and binary data)
- `stat` - Get detailed file/directory statistics
- `writeFile` - Write files (text and binary data)
- `fileSize` - Get file size
- `delete` - Delete files/directories (with recursive option)

### Process Operations
- `spawn` - Spawn a process with arguments and capture output
- `exec` - Execute shell commands

### Key Capabilities
- Binary data support via base64 encoding
- Full TypeScript support with type safety
- Built on tRPC for end-to-end type safety
- Cross-platform binary distribution (Linux x64/ARM64, macOS x64/ARM64)
- NPM package for client library integration
- Bun runtime for high performance

## Installation

### Option 1: Install Binary (Recommended)

Download and execute the install script:

```bash
curl -fsSL https://raw.githubusercontent.com/supervise-dev/bridge/master/install.sh | bash
```

**Specify a custom install directory:**

```bash
INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/supervise-dev/bridge/master/install.sh | bash
```

**Install a specific version:**

```bash
curl -fsSL https://raw.githubusercontent.com/supervise-dev/bridge/master/install.sh | bash -s v1.0.0
```

**Common install directories:**
- `/usr/local/bin` - System-wide binary (requires sudo for some systems)
- `$HOME/.local/bin` - User-specific binary (add to PATH if needed)
- `.` - Current directory (default)

**Security tip:** Review the script before executing:

```bash
curl -fsSL https://raw.githubusercontent.com/supervise-dev/bridge/master/install.sh -o install.sh
cat install.sh  # Review the script
bash install.sh
```

### Option 2: Install as NPM Package

```bash
npm install @supervise-dev/bridge
# or
pnpm add @supervise-dev/bridge
```

### Option 3: Development Installation

For local development:

```bash
bun install
pnpm run build
```

## Quick Start

### Running the Server

Start the tRPC server (default port: 3000):

```bash
# Using the binary
bridge

# Or with a custom port
SV_BRIDGE_PORT=4000 bridge
```

The server will be available at `http://localhost:3000/trpc`.

### Client Usage

#### Filesystem Client

```typescript
import { createFsClient } from '@supervise-dev/bridge';

const fs = createFsClient('http://localhost:3000/trpc');

// Check if file exists
const exists = await fs.exists('/path/to/file');

// Create directory
await fs.mkdir('/path/to/dir', { recursive: true });

// Write file
await fs.writeFile('/path/to/file.txt', 'Hello World', { encoding: 'utf-8' });

// Read file
const content = await fs.readFile('/path/to/file.txt', { encoding: 'utf-8' });

// Get file stats
const stats = await fs.stat('/path/to/file.txt');

// Get file size
const size = await fs.fileSize('/path/to/file.txt');

// Read directory with file type information
const files = await fs.readdir('/path/to/dir', { withFileTypes: true });
// Returns: [{ name: 'file.txt', isFile: true, isDirectory: false, isSymbolicLink: false }, ...]

// Delete file or directory
await fs.delete('/path/to/file', { recursive: true });
```

#### Process Client

```typescript
import { createProcessClient } from '@supervise-dev/bridge';

const proc = createProcessClient('http://localhost:3000/trpc');

// Spawn a process
const result = await proc.spawn({
  command: ['ls', '-la', '/tmp'],
  options: { cwd: '/home/createdBy' }
});

console.log(result.stdout);  // Process output
console.log(result.stderr);  // Error output if any
console.log(result.exitCode);
console.log(result.success); // true if exitCode === 0

// Execute a shell command
const result = await proc.exec({
  command: 'npm install',
  options: { cwd: '/path/to/project' }
});
```

### Binary Data Handling

Both text and binary data are automatically handled:

```typescript
const fs = createFsClient('http://localhost:3000/trpc');

// Write binary data
await fs.writeFile('/path/to/binary.bin',
  Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f])
);

// Read binary data (returns Buffer with base64-encoded content)
const data = await fs.readFile('/path/to/binary.bin');
// Type: { type: 'Buffer', data: 'SGVsbG8=' }
if (data.type === 'Buffer') {
  const buffer = Buffer.from(data.data, 'base64');
}
```

## API Reference

### Filesystem Client (`createFsClient`)

#### Queries (Read Operations)

- `exists(path: string): Promise<boolean>` - Check if path exists
- `readdir(path: string, options?: { withFileTypes?: boolean }): Promise<string[] | Dirent[]>` - Read directory
- `readFile(path: string, options?: { encoding?: string }): Promise<string | { type: 'Buffer', data: string }>` - Read file
- `stat(path: string, options?: any): Promise<Stats>` - Get file stats
- `fileSize(path: string): Promise<number>` - Get file size

#### Mutations (Write Operations)

- `mkdir(path: string, options?: { recursive?: boolean }): Promise<string | undefined>` - Create directory
- `writeFile(path: string, data: string | Buffer, options?: { encoding?: string }): Promise<{ success: true }>` - Write file
- `delete(path: string, options?: { recursive?: boolean, force?: boolean }): Promise<{ success: true }>` - Delete file/directory

### Process Client (`createProcessClient`)

- `spawn(input: { command: string[], options?: { cwd?: string, env?: Record<string, string>, stdin?: string, stdout?: string, stderr?: string } }): Promise<ProcessOutput>` - Spawn a process
- `exec(input: { command: string, options?: { cwd?: string, env?: Record<string, string> } }): Promise<ProcessOutput>` - Execute shell command

#### ProcessOutput Type

```typescript
interface ProcessOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean; // true if exitCode === 0
}
```

## Build & Development

### Scripts

```bash
# Development
make dev-server              # Run server with watch mode
make build-client            # Build TypeScript client library
make build                   # Build client + default binary
make build-all               # Build all platform binaries
make build-linux-x64         # Build Linux x64
make build-linux-arm64       # Build Linux ARM64
make build-darwin-x64        # Build macOS x64
make build-darwin-arm64      # Build macOS ARM64

# Maintenance
make clean                   # Remove build artifacts
make platform-info           # Show platform information
make help                    # Show all available commands

# Or using pnpm directly
pnpm run dev:server          # Start development server
pnpm run build:client        # Build client library
pnpm run build:bridge        # Build bridge binary
pnpm run lint                # Run ESLint
pnpm run format              # Format with Prettier
pnpm run typecheck           # Run TypeScript check
```

## Architecture

### Components

1. **Router** (`src/router.ts`) - tRPC procedure definitions for filesystem and process operations
2. **Server** (`src/index.ts`) - Bun HTTP server with tRPC fetch adapter
3. **Filesystem Module** (`src/fs/`) - Filesystem operation implementations
4. **Process Module** (`src/process/`) - Process spawning and execution
5. **Clients** (`src/fs/client.ts`, `src/process/client.ts`) - Type-safe client wrappers
6. **Type Definitions** (`src/*/index.types.ts`) - Zod schemas and TypeScript types

### Directory Structure

```
src/
├── index.ts                    # Server entry point
├── router.ts                   # tRPC router definition
├── schema.ts                   # Shared error schema
├── client.ts                   # Client library exports
├── fs/
│   ├── index.ts               # Filesystem operations
│   ├── index.types.ts         # Filesystem type definitions
│   └── client.ts              # Filesystem client wrapper
└── process/
    ├── index.ts               # Process operations
    ├── index.types.ts         # Process type definitions
    └── client.ts              # Process client wrapper
```

## Security Considerations

This bridge provides **unrestricted access** to the server's filesystem and process operations. In production:

⚠️ **Important**
- Implement authentication and authorization
- Add path validation and sandboxing
- Use HTTPS for encrypted communication
- Implement rate limiting and request throttling
- Add comprehensive request logging and auditing
- Restrict network access to trusted clients only
- Consider running in a containerized/isolated environment
- Validate and sanitize all inputs
- Use process isolation (e.g., seccomp, AppArmor)

## License

MIT
