
import { z } from "zod"

export const FileSchema = z.object({
  size: z.number(),
  type: z.string(),
  filename: z.string(),
  url: z.string().url(),
});