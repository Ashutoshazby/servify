import { z } from "zod";

export const providerQuerySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    serviceId: z.string().optional(),
    categoryId: z.string().optional(),
    minRating: z.string().optional(),
    verified: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    lng: z.string().optional(),
    lat: z.string().optional(),
  }),
});

export const providerSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    servicesOffered: z.array(z.string()).default([]),
    experienceYears: z.number().nonnegative().optional(),
    bio: z.string().optional(),
    location: z
      .object({
        coordinates: z.array(z.number()).length(2).optional(),
        address: z.string().optional(),
      })
      .optional(),
    availabilitySchedule: z.array(z.any()).optional(),
    isVerified: z.boolean().optional(),
  }),
  params: z.object({ id: z.string().optional() }).optional(),
  query: z.object({}).optional(),
});
