/**
 * Code Bridge - Client Library
 *
 * This module exports all client functions for interacting with the code-bridge server.
 */
export { createFsClient } from "./fs/client";
export { createProcessClient } from "./process/client";
export { errorOutput } from "./schema";

export {
  existsInput,
  mkdirInput,
  readdirInput,
  readFileInput,
  statInput,
  writeFileInput,
  fileSizeInput,
  deleteInput,
  existsOutput,
  mkdirOutput,
  readdirOutput,
  readFileOutput,
  statOutput,
  writeFileOutput,
  fileSizeOutput,
  deleteOutput,
  direntOutput,
} from "./fs/index.types";
export { spawnInput, execInput, processOutput } from "./process/index.types";

export type {
  ExistsSyncInput,
  MkdirSyncInput,
  ReaddirSyncInput,
  ReadFileSyncInput,
  StatSyncInput,
  WriteFileSyncInput,
  FileSizeSyncInput,
  DeleteSyncInput,
  ExistsOutput,
  MkdirOutput,
  ReaddirOutput,
  ReadFileOutput,
  StatOutput,
  WriteFileOutput,
  FileSizeOutput,
  DeleteOutput,
} from "./fs/index.types";
export type { ProcessOutput, ExecInput, SpawnInput } from "./process/index.types";
