import {
  DeleteOutput,
  DeleteSyncInput,
  ExistsOutput,
  ExistsSyncInput,
  FileSizeOutput,
  FileSizeSyncInput,
  MkdirOutput,
  MkdirSyncInput,
  ReadFileOutput,
  ReadFileSyncInput,
  ReaddirOutput,
  ReaddirSyncInput,
  StatOutput,
  StatSyncInput,
  WriteFileOutput,
  WriteFileSyncInput,
} from "./index.types";
import fs from "node:fs/promises";

export const existsQuery = async ({ input }: { input: ExistsSyncInput }): Promise<ExistsOutput> => {
  try {
    await fs.access(input.path);
    return true;
  } catch {
    return false;
  }
};

export const mkdirMutation = async ({ input }: { input: MkdirSyncInput }): Promise<MkdirOutput> => {
  return fs.mkdir(input.path, input.options);
};

export const readdirQuery = async ({ input }: { input: ReaddirSyncInput }): Promise<ReaddirOutput> => {
  const result = await fs.readdir(input.path, input.options as any);
  if (Array.isArray(result) && result.length > 0 && typeof result[0] === "object" && "name" in result[0]) {
    return result.map((item: any) => ({
      name: item.name,
      isSymbolicLink: item.isSymbolicLink(),
      isFile: item.isFile(),
      isDirectory: item.isDirectory(),
    }));
  }
  return result;
};

export const readFileQuery = async ({ input }: { input: ReadFileSyncInput }): Promise<ReadFileOutput> => {
  const content = await fs.readFile(input.path, input.options as any);
  // Convert Buffer to base64 string for transmission
  if (Buffer.isBuffer(content)) {
    return { type: "Buffer" as const, data: content.toString("base64") };
  }
  return { type: "string" as const, data: content };
};

export const statQuery = async ({ input }: { input: StatSyncInput }): Promise<StatOutput> => {
  // Ensure throwIfNoEntry is not false to guarantee stats is always returned
  const options = input.options ? { ...input.options, throwIfNoEntry: true } : { throwIfNoEntry: true };
  const stats = await fs.stat(input.path, options as any);
  // Convert Stats object to plain object for serialization
  return {
    dev: stats.dev,
    ino: stats.ino,
    mode: stats.mode,
    nlink: stats.nlink,
    uid: stats.uid,
    gid: stats.gid,
    rdev: stats.rdev,
    size: stats.size,
    blksize: stats.blksize,
    blocks: stats.blocks,
    atimeMs: stats.atimeMs,
    mtimeMs: stats.mtimeMs,
    ctimeMs: stats.ctimeMs,
    birthtimeMs: stats.birthtimeMs,
    atime: stats.atime.toISOString(),
    mtime: stats.mtime.toISOString(),
    ctime: stats.ctime.toISOString(),
    birthtime: stats.birthtime.toISOString(),
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    isSymbolicLink: stats.isSymbolicLink(),
  };
};

export const writeFileMutation = async ({ input }: { input: WriteFileSyncInput }): Promise<WriteFileOutput> => {
  let data: string | Buffer;
  if (typeof input.data === "object" && "type" in input.data && input.data.type === "Buffer") {
    data = Buffer.from(input.data.data, "base64");
  } else {
    data = input.data as string;
  }
  await fs.writeFile(input.path, data, input.options as any);
  return { success: true };
};

export const fileSizeQuery = async ({ input }: { input: FileSizeSyncInput }): Promise<FileSizeOutput> => {
  const stats = await fs.stat(input.path);
  return stats.size;
};

export const deleteMutation = async ({ input }: { input: DeleteSyncInput }): Promise<DeleteOutput> => {
  await fs.rm(input.path, input.options as any);
  return { success: true };
};
