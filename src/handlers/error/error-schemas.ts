import { z } from "zod";

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.object({
    issues: z.any(),
    method: z.string(),
    url: z.string(),
    stack: z.string().optional(),
  }),
});
