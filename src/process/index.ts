import { ExecInput, ProcessOutput, SpawnInput } from "./index.types";

/**
 * Spawns a child process with the given command and arguments.
 *
 * This mutation provides low-level control over process execution, allowing configuration of working directory,
 * environment variables, and stdin/stdout/stderr handling. Uses Bun's spawn API.
 *
 * @example
 *   ```typescript
 *   const result = await spawnMutation({
 *     input: {
 *       command: ['ls', '-la', '/tmp'],
 *       options: { cwd: '/home', stdout: 'pipe' }
 *     }
 *   });
 *   console.log(result.stdout); // File listing
 *   ```;
 *
 * @param input - The spawn input containing command and optional configuration
 * @param input.input - Configuration object
 * @param input.input.command - Array of command and arguments [executable, arg1, arg2, ...]
 * @param input.input.options.cwd - Optional working directory for the process
 * @param input.input.options.env - Optional environment variables to pass to the process
 * @param input.input.options.stdin - Optional stdin stream handling ('pipe', 'inherit', 'ignore')
 * @param input.input.options.stdout - Optional stdout stream handling ('pipe', 'inherit', 'ignore')
 * @param input.input.options.stderr - Optional stderr stream handling ('pipe', 'inherit', 'ignore')
 * @returns Promise that resolves to ProcessOutput with stdout, stderr, exitCode, and success status
 * @throws Will reject if the process cannot be spawned
 */
export const spawnMutation = async ({ input }: { input: SpawnInput }): Promise<ProcessOutput> => {
  const [cmd, ...args] = input.command;

  const proc = Bun.spawn([cmd, ...args], {
    cwd: input.options?.cwd,
    env: input.options?.env,
    stdin: input.options?.stdin,
    stdout: input.options?.stdout ?? "pipe",
    stderr: input.options?.stderr ?? "pipe",
  });

  const [stdout, stderr] = await Promise.all([
    proc.stdout ? new Response(proc.stdout).text() : Promise.resolve(""),
    proc.stderr ? new Response(proc.stderr).text() : Promise.resolve(""),
  ]);

  const exitCode = await proc.exited;

  return {
    stdout,
    stderr,
    exitCode,
    success: exitCode === 0,
  };
};

/**
 * Executes a shell command using Bun's native shell interpreter.
 *
 * This mutation provides a simplified interface for running shell commands. The command is executed within a shell
 * context, allowing for features like pipes, redirects, and shell expansions. Environment variables and working
 * directory can be customized.
 *
 * @example
 *   ```typescript
 *   const result = await execMutation({
 *     input: {
 *       command: ['echo', 'Hello World'],
 *       options: { cwd: '/home' }
 *     }
 *   });
 *   console.log(result.stdout); // "Hello World\n"
 *   ```;
 *
 * @param input - The exec input containing command and optional configuration
 * @param input.input - Configuration object
 * @param input.input.command - Array of command and arguments [executable, arg1, arg2, ...]
 * @param input.input.options.cwd - Optional working directory for command execution
 * @param input.input.options.env - Optional environment variables to pass to the command
 * @param input.input.options.shell - Optional flag for shell interpretation (typically handled automatically)
 * @returns Promise that resolves to ProcessOutput with stdout, stderr, exitCode, and success status
 * @throws Will reject if the command cannot be executed or shell execution fails
 */
export const execMutation = async ({ input }: { input: ExecInput }): Promise<ProcessOutput> => {
  const { $ } = await import("bun");

  // Set options if provided
  if (input.options?.cwd) {
    $.cwd(input.options.cwd);
  }

  if (input.options?.env) {
    $.env(input.options.env);
  }

  // Execute the command with array of strings
  const [cmd, ...args] = input.command;
  const result = await $`${cmd} ${args}`;

  return {
    stdout: result.stdout.toString(),
    stderr: result.stderr.toString(),
    exitCode: result.exitCode,
    success: result.exitCode === 0,
  };
};
