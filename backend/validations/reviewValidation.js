import { z } from "zod";

export const reviewSchema = z.object({
  body: z.object({
    providerId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
