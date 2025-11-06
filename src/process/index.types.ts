import { z } from "zod";

/** Input schema for spawning a process */
export const spawnInput = z.object({
  command: z.array(z.string()).min(1),
  options: z
    .object({
      cwd: z.string().optional(),
      env: z.record(z.string()).optional(),
      stdin: z.enum(["pipe", "inherit", "ignore"]).optional(),
      stdout: z.enum(["pipe", "inherit", "ignore"]).optional(),
      stderr: z.enum(["pipe", "inherit", "ignore"]).optional(),
    })
    .optional(),
});

/** Input schema for executing a shell command */
export const execInput = z.object({
  command: z.string(),
  options: z
    .object({
      cwd: z.string().optional(),
      env: z.record(z.string()).optional(),
      shell: z.boolean().optional(),
    })
    .optional(),
});

/** Output schema for process execution */
export const processOutput = z.object({
  stdout: z.string(),
  stderr: z.string(),
  exitCode: z.number().nullable(),
  success: z.boolean(),
});

export type SpawnInput = z.infer<typeof spawnInput>;
export type ExecInput = z.infer<typeof execInput>;
export type ProcessOutput = z.infer<typeof processOutput>;
