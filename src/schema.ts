import { z } from "zod";

export const errorOutput = z.object({
  error: z.string(),
});

export type ApiError = z.infer<typeof errorOutput>;
