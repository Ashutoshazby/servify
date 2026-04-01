import { z } from "zod";

export const serviceSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    categoryId: z.string().min(1),
    description: z.string().optional(),
    basePrice: z.number().nonnegative(),
    duration: z.number().min(15),
    images: z.array(z.string()).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
