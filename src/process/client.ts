import type { BridgeRouter } from "../router";
import { ExecInput, ProcessOutput, SpawnInput } from "./index.types";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

/**
 * Creates a tRPC-based process management client for remote process execution.
 *
 * This factory function creates a client that communicates with a bridge server via tRPC, allowing for remote spawning
 * and execution of processes. The client provides two main methods:
 *
 * - `spawn`: For low-level process control with configuration
 * - `exec`: For simple shell command execution
 *
 * The client uses HTTP batch linking for efficient request handling and automatically handles
 * serialization/deserialization of process I/O.
 *
 * @example
 *   ```TypeScript
 *   const client = createProcessClient('http://localhost:3000');
 *
 *   // Spawn a process with full control over environment and I/O
 *   const spawnResult = await client.spawn({
 *     command: ['ls', '-la', '/tmp'],
 *     options: { cwd: '/home/user', stdout: 'pipe' }
 *   });
 *   console.log(spawnResult.stdout);
 *
 *   // Execute a simple shell command
 *   const execResult = await client.exec({
 *     command: ['echo', 'Hello World']
 *   });
 *   console.log(execResult.stdout); // "Hello World\n"
 *   ```;
 *
 * @param url - The tRPC server URL endpoint (e.g., "http://localhost:3000" or "https://api.example.com")
 * @returns A process management client object with `spawn` and `exec` methods
 * @throws Will throw if the server URL is invalid or unreachable
 */
export function createProcessClient(url: string) {
  const client = createTRPCClient<BridgeRouter>({
    links: [httpBatchLink({ url })],
  });

  return {
    /**
     * Spawns a child process with granular control over command execution.
     *
     * This method provides low-level process control, allowing configuration of the working directory, environment
     * variables, and how stdin/stdout/stderr are handled. It's suitable for complex process management scenarios where
     * you need precise control over I/O streams.
     *
     * The command and arguments must be passed as separate array elements for proper argument handling.
     *
     * @example
     *   ```TypeScript
     *   const output = await client.spawn({
     *     command: ['find', '.', '-name', '*.ts'],
     *     options: {
     *       cwd: '/home/project',
     *       stdout: 'pipe',
     *       env: { NODE_ENV: 'production' }
     *     }
     *   });
     *   console.log('Found files:', output.stdout);
     *   ```;
     *
     * @param args - The spawn input configuration
     * @param args.command - Array of command and arguments: first element is executable, rest are args
     * @param args.options - Optional process configuration object
     * @param args.options.cwd - Current working directory for the process execution
     * @param args.options.env - Environment variables to pass to the process as key-value pairs
     * @param args.options.stdin - Stdin stream handling: 'pipe' to capture, 'inherit' for parent stdio, 'ignore' to
     *   skip
     * @param args.options.stdout - Stdout stream handling: 'pipe' to capture, 'inherit' for parent stdio, 'ignore' to
     *   skip
     * @param args.options.stderr - Stderr stream handling: 'pipe' to capture, 'inherit' for parent stdio, 'ignore' to
     *   skip
     * @returns Promise that resolves to ProcessOutput with stdout, stderr, exitCode, and success flag
     * @throws Will reject if the remote process cannot be spawned
     */
    spawn: async (args: SpawnInput): Promise<ProcessOutput> => {
      return client.process.spawn.mutate(args);
    },

    /**
     * Executes a shell command with optional environment and working directory configuration.
     *
     * This method provides a simpler interface for running shell commands. The command is executed within a shell
     * context on the remote server, enabling features like pipes, redirects, globs, and environment variable expansion.
     * Use this when you don't need granular I/O control.
     *
     * The command should be passed as an array of strings, where the first element is the executable and subsequent
     * elements are arguments.
     *
     * @example
     *   ```TypeScript
     *   const output = await client.exec({
     *     command: ['grep', '-r', 'TODO', '.'],
     *     options: { cwd: '/home/project' }
     *   });
     *   console.log('TODOs:', output.stdout);
     *   ```;
     *
     * @param args - The exec input configuration
     * @param args.command - Array of command and arguments: first element is executable, rest are args
     * @param args.options - Optional execution configuration object
     * @param args.options.cwd - Current working directory for the command execution
     * @param args.options.env - Environment variables to pass to the command as key-value pairs
     * @param args.options.shell - Whether to use shell interpretation (typically handled automatically by the server)
     * @returns Promise that resolves to ProcessOutput with stdout, stderr, exitCode, and success flag
     * @throws Will reject if the remote command execution fails
     */
    exec: async (args: ExecInput): Promise<ProcessOutput> => {
      return client.process.exec.mutate(args);
    },
  };
}
