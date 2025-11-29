import { z } from "zod";

export const zErrorOutput = z.object({
  error: z.string(),
});

export type ErrorOutput = z.infer<typeof zErrorOutput>;
