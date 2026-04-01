import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({ bookingId: z.string() }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string(),
    paymentId: z.string(),
    signature: z.string(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const paymentFailureSchema = z.object({
  body: z.object({
    orderId: z.string(),
    reason: z.string().min(2),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const refundSchema = z.object({
  body: z.object({
    paymentId: z.string(),
    amount: z.number().positive().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
