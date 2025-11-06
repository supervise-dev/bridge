import {
  deleteMutation,
  existsQuery,
  fileSizeQuery,
  mkdirMutation,
  readFileQuery,
  readdirQuery as readdirSyncQuery,
  statQuery,
  writeFileMutation,
} from "./fs/index";
import {
  deleteInput,
  existsInput,
  fileSizeInput,
  mkdirInput,
  readFileInput,
  readdirInput,
  statInput,
  writeFileInput,
} from "./fs/index.types";
import { execMutation, spawnMutation } from "./process";
import { execInput, spawnInput } from "./process/index.types";
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

const procedure = t.procedure;
const router = t.router;

export const bridgeRouter = router({
  fs: router({
    exists: procedure.input(existsInput).query(existsQuery),
    mkdir: procedure.input(mkdirInput).mutation(mkdirMutation),
    readdir: procedure.input(readdirInput).query(readdirSyncQuery),
    readFile: procedure.input(readFileInput).query(readFileQuery),
    stat: procedure.input(statInput).query(statQuery),
    writeFile: procedure.input(writeFileInput).mutation(writeFileMutation),
    fileSize: procedure.input(fileSizeInput).query(fileSizeQuery),
    delete: procedure.input(deleteInput).mutation(deleteMutation),
  }),
  process: router({
    spawn: procedure.input(spawnInput).mutation(spawnMutation),
    exec: procedure.input(execInput).mutation(execMutation),
  }),
});

export type BridgeRouter = typeof bridgeRouter;
