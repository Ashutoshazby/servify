import { z } from "zod";

export const bookingCreateSchema = z.object({
  body: z.object({
    providerId: z.string(),
    serviceId: z.string(),
    date: z.string(),
    time: z.string(),
    price: z.number().nonnegative(),
    address: z.string().optional(),
    notes: z.string().optional(),
    promoCode: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const bookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "accepted", "in_progress", "completed", "cancelled"]),
  }),
  params: z.object({ id: z.string() }),
  query: z.object({}).optional(),
});
