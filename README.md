# tRPC Filesystem Bridge

A tRPC-based filesystem bridge that implements the `CodebuffFileSystem` interface, allowing remote filesystem operations over HTTP.

## Features

- Implements all required filesystem operations:
  - `existsSync` - Check if file/directory exists
  - `mkdirSync` - Create directories
  - `readdirSync` - Read directory contents
  - `readFileSync` - Read files (text and binary)
  - `statSync` - Get file/directory stats
  - `writeFileSync` - Write files (text and binary)
  - `promises.readdir` - Async directory reading

- Binary data support via base64 encoding
- Type-safe with full TypeScript support
- Built on tRPC for end-to-end type safety

## Installation

### Quick Install (Recommended)

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

### Development Installation

For local development:

```bash
bun install
```

## Usage

### Starting the Server

```bash
bun run dev:server
```

The server will start on `http://localhost:3000`.

### Running the Client Example

In a separate terminal:

```bash
bun run dev:client
```

### Using the Async Client (Recommended)

```typescript
import { createFsClient } from './fs-client';

const fs = createFsClient('http://localhost:3000/trpc');

// Check if file exists
const exists = await fs.existsSync('/path/to/file');

// Create directory
await fs.mkdirSync('/path/to/dir', { recursive: true });

// Write file
await fs.writeFileSync('/path/to/file.txt', 'Hello World', { encoding: 'utf-8' });

// Read file
const content = await fs.readFileSync('/path/to/file.txt', { encoding: 'utf-8' });

// Get file stats
const stats = await fs.statSync('/path/to/file.txt');

// Read directory
const files = await fs.readdirSync('/path/to/dir', { withFileTypes: true });

// Async readdir
const filesAsync = await fs.promises.readdir('/path/to/dir');
```

### Using the Raw tRPC Client

```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './router';

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000/trpc' })],
});

// Filesystem operations
const exists = await client.fs.existsSync.query({ path: '/path/to/file' });
const content = await client.fs.readFileSync.query({
  path: '/path/to/file',
  options: { encoding: 'utf-8' }
});
```

### Binary Data Handling

To read/write binary files, the data is base64 encoded:

```typescript
// Write binary data
await client.fs.writeFileSync.mutate({
  path: '/path/to/binary.bin',
  data: {
    type: 'Buffer',
    data: Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]).toString('base64'),
  },
});

// Read binary data
const result = await client.fs.readFileSync.query({ path: '/path/to/binary.bin' });
if (result.type === 'Buffer') {
  const buffer = Buffer.from(result.data, 'base64');
}
```

## Type Definition

The filesystem bridge implements the following TypeScript interface:

```typescript
type CodebuffFileSystem = Pick<
  typeof fs,
  "existsSync" | "mkdirSync" | "readdirSync" | "readFileSync" | "statSync" | "writeFileSync"
> & {
  promises: Pick<typeof fs.promises, "readdir">;
};
```

## API Reference

### Queries (Read Operations)

- `fs.existsSync` - Check if path exists
- `fs.readdirSync` - Read directory contents synchronously
- `fs.readFileSync` - Read file contents
- `fs.statSync` - Get file/directory stats
- `promises.readdir` - Read directory contents asynchronously

### Mutations (Write Operations)

- `fs.mkdirSync` - Create directory
- `fs.writeFileSync` - Write file contents

## Scripts

- `bun run dev:server` - Start development server with watch mode
- `bun run dev:client` - Run client example with watch mode
- `bun run build` - Build for production
- `bun run start:server` - Start production server
- `bun run start:client` - Run production client
- `bun run test-dev` - Run integration tests in dev mode
- `bun run test:fs-bridge` - Test the filesystem bridge
- `bun run test:codebuff` - Test Codebuff SDK integration
- `bun run typecheck` - Run TypeScript type checking

## Codebuff SDK Integration

This project includes integration with the [@codebuff/sdk](https://www.npmjs.com/package/@codebuff/sdk), demonstrating how to use the tRPC filesystem bridge with Codebuff agents.

See [CODEBUFF_INTEGRATION.md](./CODEBUFF_INTEGRATION.md) for detailed information about the integration, including:
- How to use CodebuffClient with the filesystem bridge
- Example code for running Codebuff agents
- Testing instructions
- Production deployment considerations

Quick start:
```bash
# Terminal 1: Start the tRPC server
bun run dev:server

# Terminal 2: Test the filesystem bridge (no API key needed)
bun run test:fs-bridge

# Or run the Codebuff example (requires API key)
export CODEBUFF_API_KEY=your_key_here
bun run test:codebuff
```

## Architecture

The bridge consists of three main components:

1. **Router** (`src/router.ts`) - Defines all filesystem operations as tRPC procedures
2. **Server** (`src/index.ts`) - Bun HTTP server that handles tRPC requests
3. **Client** (`src/client.ts`) - Example client demonstrating all operations

## Security Considerations

This filesystem bridge provides **unrestricted access** to the server's filesystem. In production:

- Implement authentication and authorization
- Add path validation and sandboxing
- Use HTTPS for encrypted communication
- Implement rate limiting
- Add request logging and auditing

## License

MIT
