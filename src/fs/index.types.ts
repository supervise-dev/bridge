import { z } from "zod";

export const existsInput = z.object({
  path: z.string(),
});

export const mkdirInput = z.object({
  path: z.string(),
  options: z
    .object({
      recursive: z.boolean().optional(),
      mode: z.number().optional(),
    })
    .optional(),
});

export const readdirInput = z.object({
  path: z.string(),
  options: z
    .union([
      z.object({
        encoding: z.string().optional(),
        withFileTypes: z.boolean().optional(),
      }),
      z.string(),
    ])
    .optional(),
});

export const readFileInput = z.object({
  path: z.string(),
  options: z
    .union([
      z.object({
        encoding: z.string().optional(),
        flag: z.string().optional(),
      }),
      z.string(),
    ])
    .optional(),
});

export const statInput = z.object({
  path: z.string(),
  options: z
    .object({
      bigint: z.boolean().optional(),
      throwIfNoEntry: z.boolean().optional(),
    })
    .optional(),
});

export const writeFileInput = z.object({
  path: z.string(),
  data: z.union([
    z.string(),
    z.object({
      type: z.literal("Buffer"),
      data: z.string(), // base64 encoded
    }),
  ]),
  options: z
    .union([
      z.object({
        encoding: z.string().optional(),
        mode: z.number().optional(),
        flag: z.string().optional(),
      }),
      z.string(),
    ])
    .optional(),
});

// Output Schemas

export const existsOutput = z.boolean();

export const mkdirOutput = z.string().or(z.undefined()).nullable();

export const direntOutput = z.object({
  name: z.string(),
  isSymbolicLink: z.boolean(),
  isFile: z.boolean(),
  isDirectory: z.boolean(),
});

export const readdirOutput = z.union([z.array(z.string()), z.array(direntOutput)]);

export const readFileOutput = z.object({
  type: z.enum(["Buffer", "string"]),
  data: z.string(),
});

export const statOutput = z.object({
  dev: z.number(),
  ino: z.number(),
  mode: z.number(),
  nlink: z.number(),
  uid: z.number(),
  gid: z.number(),
  rdev: z.number(),
  size: z.number(),
  blksize: z.number(),
  blocks: z.number(),
  atimeMs: z.number(),
  mtimeMs: z.number(),
  ctimeMs: z.number(),
  birthtimeMs: z.number(),
  atime: z.string(),
  mtime: z.string(),
  ctime: z.string(),
  birthtime: z.string(),
  isFile: z.boolean(),
  isDirectory: z.boolean(),
  isSymbolicLink: z.boolean(),
});

export const writeFileOutput = z.object({
  success: z.boolean(),
});

export const fileSizeInput = z.object({
  path: z.string(),
});

export const fileSizeOutput = z.number();

export const deleteInput = z.object({
  path: z.string(),
  options: z
    .object({
      recursive: z.boolean().optional(),
      force: z.boolean().optional(),
    })
    .optional(),
});

export const deleteOutput = z.object({
  success: z.boolean(),
});

export type ExistsSyncInput = z.infer<typeof existsInput>;
export type MkdirSyncInput = z.infer<typeof mkdirInput>;
export type ReaddirSyncInput = z.infer<typeof readdirInput>;
export type ReadFileSyncInput = z.infer<typeof readFileInput>;
export type StatSyncInput = z.infer<typeof statInput>;
export type WriteFileSyncInput = z.infer<typeof writeFileInput>;
export type FileSizeSyncInput = z.infer<typeof fileSizeInput>;
export type DeleteSyncInput = z.infer<typeof deleteInput>;

export type ExistsOutput = z.infer<typeof existsOutput>;
export type MkdirOutput = z.infer<typeof mkdirOutput>;
export type ReaddirOutput = z.infer<typeof readdirOutput>;
export type ReadFileOutput = z.infer<typeof readFileOutput>;
export type StatOutput = z.infer<typeof statOutput>;
export type WriteFileOutput = z.infer<typeof writeFileOutput>;
export type FileSizeOutput = z.infer<typeof fileSizeOutput>;
export type DeleteOutput = z.infer<typeof deleteOutput>;
export type Dirent = z.infer<typeof direntOutput>;
