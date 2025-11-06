import type { BridgeRouter } from "../router";
import type { ProcessOutput } from "./index.types";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

/**
 * Creates a process management client that provides methods to spawn and execute processes remotely via tRPC.
 *
 * @example
 *   ```TypeScript
 *   const proc = createProcessClient('http://localhost:3000');
 *
 *   // Spawn a process with arguments
 *   const result = await proc.spawn(['ls', '-la', '/tmp']);
 *   console.log(result.stdout);
 *
 *   // Execute a shell command
 *   const result = await proc.exec('ls -la /tmp');
 *   console.log(result.stdout);
 *   ```;
 *
 * @param url - The tRPC server URL (e.g., "http://localhost:3000")
 * @returns A process management client with promise-based methods
 */
export function createProcessClient(url: string) {
  const client = createTRPCClient<BridgeRouter>({
    links: [httpBatchLink({ url })],
  });

  return {
    /**
     * Spawn a process with the given command and arguments. Provides more control over stdin, stdout, stderr, and other
     * options.
     *
     * @param command - Array of command and arguments (e.g., ['ls', '-la'])
     * @param options - Optional process spawn options
     * @param options.cwd - Current working directory for the process
     * @param options.env - Environment variables for the process
     * @param options.stdin - How to handle stdin: 'pipe', 'inherit', or 'ignore'
     * @param options.stdout - How to handle stdout: 'pipe', 'inherit', or 'ignore'
     * @param options.stderr - How to handle stderr: 'pipe', 'inherit', or 'ignore'
     * @returns Promise that resolves to the process output
     */
    spawn: async (
      command: string[],
      options?: {
        cwd?: string;
        env?: Record<string, string>;
        stdin?: "pipe" | "inherit" | "ignore";
        stdout?: "pipe" | "inherit" | "ignore";
        stderr?: "pipe" | "inherit" | "ignore";
      },
    ): Promise<ProcessOutput> => {
      return client.process.spawn.mutate({ command, options });
    },

    /**
     * Execute a shell command using Bun's shell interpreter. Simpler interface for running shell commands.
     *
     * @param command - The shell command to execute (e.g., 'ls -la /tmp')
     * @param options - Optional execution options
     * @param options.cwd - Current working directory for the command
     * @param options.env - Environment variables for the command
     * @param options.shell - Whether to use shell interpretation (default: true)
     * @returns Promise that resolves to the process output
     */
    exec: async (
      command: string,
      options?: {
        cwd?: string;
        env?: Record<string, string>;
        shell?: boolean;
      },
    ): Promise<ProcessOutput> => {
      return client.process.exec.mutate({ command, options });
    },
  };
}
