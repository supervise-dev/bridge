import { z } from "zod";

/** Input schema for checking if a file or directory exists at a path */
export const existsInput = z.object({
  path: z.string().describe("Absolute or relative file path to check for existence"),
});

/** Input schema for creating a directory */
export const mkdirInput = z.object({
  path: z.string().describe("Absolute or relative directory path to create"),
  options: z
    .object({
      recursive: z
        .boolean()
        .optional()
        .describe("If true, creates parent directories as needed (default: false)"),
      mode: z
        .number()
        .optional()
        .describe("Unix file mode permissions (e.g., 0o755). If not specified, uses system default"),
    })
    .optional()
    .describe("Optional creation settings"),
});

/** Input schema for listing files and directories */
export const readdirInput = z.object({
  path: z.string().describe("Absolute or relative directory path to list"),
  options: z
    .union([
      z.object({
        encoding: z.string().optional().describe("Character encoding for filenames (e.g., 'utf8')"),
        withFileTypes: z
          .boolean()
          .optional()
          .describe(
            "If true, returns objects with file type info (isFile, isDirectory). If false, returns just filenames"
          ),
      }),
      z.string().describe("Character encoding string (e.g., 'utf8')"),
    ])
    .optional()
    .describe("Optional encoding and format settings"),
});

/** Input schema for reading file contents */
export const readFileInput = z.object({
  path: z.string().describe("Absolute or relative path to the file to read"),
  options: z
    .union([
      z.object({
        encoding: z
          .string()
          .optional()
          .describe("Character encoding (e.g., 'utf8'). If omitted, returns Buffer"),
        flag: z
          .string()
          .optional()
          .describe('File open flag (e.g., "r" for read-only). Default is "r"'),
      }),
      z.string().describe("Character encoding string (e.g., 'utf8')"),
    ])
    .optional()
    .describe("Optional encoding and file flag settings"),
});

/** Input schema for getting file or directory metadata */
export const statInput = z.object({
  path: z.string().describe("Absolute or relative path to stat"),
  options: z
    .object({
      bigint: z
        .boolean()
        .optional()
        .describe("If true, returns numeric values as BigInt instead of Number"),
      throwIfNoEntry: z
        .boolean()
        .optional()
        .describe("If false, returns undefined instead of throwing when file not found"),
    })
    .optional()
    .describe("Optional stat settings"),
});

/** Input schema for writing file contents */
export const writeFileInput = z.object({
  path: z.string().describe("Absolute or relative path to create or overwrite"),
  data: z
    .union([
      z.string().describe("Text content to write"),
      z.object({
        type: z.literal("Buffer").describe("Indicates binary data"),
        data: z.string().describe("Base64-encoded binary data"),
      }),
    ])
    .describe("File content as text string or base64-encoded binary Buffer"),
  options: z
    .union([
      z.object({
        encoding: z
          .string()
          .optional()
          .describe("Character encoding for text (e.g., "utf8"). Default: "utf8"'),
        mode: z
          .number()
          .optional()
          .describe("Unix file mode permissions (e.g., 0o644). If not specified, uses system default"),
        flag: z
          .string()
          .optional()
          .describe('File open flag (e.g., "w" for write). Default: "w"'),
      }),
      z.string().describe("Character encoding string (e.g., 'utf8')"),
    ])
    .optional()
    .describe("Optional encoding, permissions, and file flag settings"),
});

// Output Schemas

/** Returns true if file/directory exists, false otherwise */
export const existsOutput = z
  .boolean()
  .describe("true if the path exists, false if it does not");

/** Returns the path to the newly created directory, or undefined if recursive was false and parent dirs already exist */
export const mkdirOutput = z
  .string()
  .or(z.undefined())
  .nullable()
  .describe("Path to created directory, or undefined/null if directory already existed");

/** Metadata about a single directory entry */
export const direntOutput = z.object({
  name: z.string().describe("Name of the file or directory"),
  isSymbolicLink: z.boolean().describe("true if this is a symbolic link"),
  isFile: z.boolean().describe("true if this is a regular file"),
  isDirectory: z.boolean().describe("true if this is a directory"),
});

/** Array of directory entries - either as filenames (string[]) or with metadata (Dirent[]) */
export const readdirOutput = z
  .union([z.array(z.string()), z.array(direntOutput)])
  .describe("List of files/directories: either filenames or full entry objects with type info");

/** File contents with type information */
export const readFileOutput = z.object({
  type: z.enum(["Buffer", "string"]).describe("Type of data: 'Buffer' for binary, 'string' for text"),
  data: z
    .string()
    .describe(
      "File contents: base64-encoded if type is Buffer, UTF-8 text if type is string"
    ),
});

/** File system metadata - mirrors Node.js fs.Stats */
export const statOutput = z.object({
  dev: z.number().describe("Device ID"),
  ino: z.number().describe("Inode number"),
  mode: z.number().describe("Unix file mode bits (permissions and file type)"),
  nlink: z.number().describe("Number of hard links"),
  uid: z.number().describe("User ID of owner"),
  gid: z.number().describe("Group ID of owner"),
  rdev: z.number().describe("Device ID if special file"),
  size: z.number().describe("File size in bytes"),
  blksize: z.number().describe("Block size for filesystem I/O"),
  blocks: z.number().describe("Number of 512-byte blocks allocated"),
  atimeMs: z.number().describe("Last access time in milliseconds since epoch"),
  mtimeMs: z.number().describe("Last modification time in milliseconds since epoch"),
  ctimeMs: z.number().describe("Change time in milliseconds since epoch"),
  birthtimeMs: z.number().describe("Birth (creation) time in milliseconds since epoch"),
  atime: z.string().describe("Last access time as ISO string"),
  mtime: z.string().describe("Last modification time as ISO string"),
  ctime: z.string().describe("Change time as ISO string"),
  birthtime: z.string().describe("Birth (creation) time as ISO string"),
  isFile: z.boolean().describe("true if regular file"),
  isDirectory: z.boolean().describe("true if directory"),
  isSymbolicLink: z.boolean().describe("true if symbolic link"),
});

/** Response indicating successful file write */
export const writeFileOutput = z.object({
  success: z.boolean().describe("true if file was written successfully"),
});

/** Input schema for getting file size */
export const fileSizeInput = z.object({
  path: z.string().describe("Absolute or relative path to the file"),
});

/** File size in bytes */
export const fileSizeOutput = z.number().describe("Size of the file in bytes");

/** Input schema for deleting a file or directory */
export const deleteInput = z.object({
  path: z.string().describe("Absolute or relative path to file or directory to delete"),
  options: z
    .object({
      recursive: z
        .boolean()
        .optional()
        .describe("If true, recursively delete directory and contents. If false, only empty dirs"),
      force: z
        .boolean()
        .optional()
        .describe("If true, ignore errors if file does not exist"),
    })
    .optional()
    .describe("Optional deletion settings"),
});

/** Response indicating successful deletion */
export const deleteOutput = z.object({
  success: z.boolean().describe("true if file/directory was deleted successfully"),
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
