import type { BridgeRouter } from "../router.ts";
import {
  DeleteOutput,
  ExistsOutput,
  FileSizeOutput,
  MkdirOutput,
  ReadFileOutput,
  ReaddirOutput,
  StatOutput,
  WriteFileOutput,
} from "./index.types";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

/**
 * Creates an async filesystem client that provides all operations as promises. This is the recommended way to use the
 * filesystem bridge over tRPC.
 *
 * @example
 *   ```TypeScript
 *   const fs = createFsClient('http://localhost:3000');
 *   const exists = await fs.exists('/path/to/file');
 *   const files = await fs.readdir('/some/directory');
 *   ```
 *
 *   Note: All operations are asynchronous.
 *
 * @param url - The tRPC server URL (e.g., "http://localhost:3000")
 * @returns An async filesystem client with promise-based methods
 */
export function createFsClient(url: string) {
  const client = createTRPCClient<BridgeRouter>({
    links: [httpBatchLink({ url })],
  });

  return {
    /**
     * Check if a file or directory exists.
     *
     * @param path - The path to check
     * @returns Promise that resolves to true if the path exists, false otherwise
     */
    exists: async (path: string): Promise<ExistsOutput> => {
      return client.fs.exists.query({ path });
    },

    /**
     * Create a directory.
     *
     * @param path - The path of the directory to create
     * @param options - Optional settings for directory creation
     * @param options.recursive - If true, creates parent directories as needed
     * @param options.mode - The file mode (permission and sticky bits)
     * @returns Promise that resolves when the directory is created
     */
    mkdir: async (path: string, options?: { recursive?: boolean; mode?: number }): Promise<MkdirOutput> => {
      return await client.fs.mkdir.mutate({ path, options });
    },

    /**
     * Read the contents of a directory.
     *
     * @param path - The path to the directory
     * @param options - Optional settings for reading the directory
     * @param options.encoding - The character encoding to use
     * @param options.withFileTypes - If true, returns Dirent objects instead of strings
     * @returns Promise that resolves to an array of filenames or Dirent objects
     */
    readdir: async (
      path: string,
      options?: { encoding?: string; withFileTypes?: boolean } | string,
    ): Promise<ReaddirOutput> => {
      return client.fs.readdir.query({ path, options });
    },

    /**
     * Read the contents of a file.
     *
     * @param path - The path to the file
     * @param options - Optional settings for reading the file
     * @param options.encoding - The character encoding to use (e.g., 'utf8')
     * @param options.flag - File system flag (default: 'r')
     * @returns Promise that resolves to the file contents as a string or Buffer
     */
    readFile: async (
      path: string,
      options?: { encoding?: string; flag?: string } | string,
    ): Promise<ReadFileOutput> => {
      return client.fs.readFile.query({ path, options });
    },

    /**
     * Get file or directory statistics.
     *
     * @param path - The path to the file or directory
     * @param options - Optional settings for stat
     * @param options.bigint - If true, numeric values will be returned as bigints
     * @returns Promise that resolves to a stats object with file information
     */
    stat: async (path: string, options?: { bigint?: boolean }): Promise<StatOutput> => {
      return client.fs.stat.query({ path, options });
    },

    /**
     * Write data to a file, replacing the file if it already exists.
     *
     * @param path - The path to the file
     * @param data - The data to write (string or Buffer object with base64 data)
     * @param options - Optional settings for writing the file
     * @param options.encoding - The character encoding (default: 'utf8')
     * @param options.mode - The file mode (permission and sticky bits)
     * @param options.flag - File system flag (default: 'w')
     * @returns Promise that resolves to an object indicating success
     */
    writeFile: async (
      path: string,
      data: string | { type: "Buffer"; data: string },
      options?: { encoding?: string; mode?: number; flag?: string } | string,
    ): Promise<WriteFileOutput> => {
      return client.fs.writeFile.mutate({ path, data, options });
    },

    /**
     * Get the size of a file in bytes.
     *
     * @param path - The path to the file
     * @returns Promise that resolves to the file size in bytes
     */
    fileSize: async (path: string): Promise<FileSizeOutput> => {
      return client.fs.fileSize.query({ path });
    },

    /**
     * Delete a file or directory.
     *
     * @param path - The path to the file or directory to delete
     * @param options - Optional settings for deletion
     * @param options.recursive - If true, recursively delete directories and their contents
     * @param options.force - If true, ignore errors (e.g., file doesn't exist)
     * @returns Promise that resolves to an object indicating success
     */
    delete: async (path: string, options?: { recursive?: boolean; force?: boolean }): Promise<DeleteOutput> => {
      return client.fs.delete.mutate({ path, options });
    },
  };
}
