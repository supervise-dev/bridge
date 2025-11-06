import { z } from "zod";

/** Input schema for spawning a process with command and arguments separated as array */
export const spawnInput = z.object({
  command: z
    .array(z.string())
    .min(1)
    .describe(
      "Command to run as array of strings: [executable, arg1, arg2, ...]. First element is the program name"
    ),
  options: z
    .object({
      cwd: z
        .string()
        .optional()
        .describe("Working directory for the spawned process. Defaults to current directory"),
      env: z
        .record(z.string())
        .optional()
        .describe("Environment variables to pass to process as key-value pairs"),
      stdin: z
        .enum(["pipe", "inherit", "ignore"])
        .optional()
        .describe(
          "stdin handling: 'pipe' to capture, 'inherit' to use parent stdio, 'ignore' to ignore"
        ),
      stdout: z
        .enum(["pipe", "inherit", "ignore"])
        .optional()
        .describe(
          "stdout handling: 'pipe' to capture, 'inherit' to use parent stdio, 'ignore' to discard"
        ),
      stderr: z
        .enum(["pipe", "inherit", "ignore"])
        .optional()
        .describe(
          "stderr handling: 'pipe' to capture, 'inherit' to use parent stdio, 'ignore' to discard"
        ),
    })
    .optional()
    .describe("Optional process configuration"),
});

/** Input schema for executing a shell command as a string */
export const execInput = z.object({
  command: z.string().describe("Shell command to execute as a single string (e.g., 'npm install')"),
  options: z
    .object({
      cwd: z
        .string()
        .optional()
        .describe("Working directory for the command execution. Defaults to current directory"),
      env: z
        .record(z.string())
        .optional()
        .describe("Environment variables to pass to the command as key-value pairs"),
      shell: z
        .boolean()
        .optional()
        .describe("If true, run command with shell. Usually handled automatically"),
    })
    .optional()
    .describe("Optional command configuration"),
});

/** Output schema containing process execution results */
export const processOutput = z.object({
  stdout: z.string().describe("Standard output produced by the process"),
  stderr: z.string().describe("Standard error output produced by the process"),
  exitCode: z.number().nullable().describe("Process exit code (0 = success, non-zero = failure)"),
  success: z
    .boolean()
    .describe("true if exitCode was 0 (successful), false if exitCode was non-zero (failed)"),
});

export type SpawnInput = z.infer<typeof spawnInput>;
export type ExecInput = z.infer<typeof execInput>;
export type ProcessOutput = z.infer<typeof processOutput>;
