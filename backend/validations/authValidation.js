import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(8),
    role: z.enum(["customer", "provider", "admin"]).optional(),
    address: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    deviceToken: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().email() }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    code: z.string().min(4),
    newPassword: z.string().min(6),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const refreshTokenSchema = z.object({
  body: z.object({ refreshToken: z.string().min(10) }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const otpSchema = z.object({
  body: z.object({
    target: z.string().min(3),
    channel: z.enum(["email", "phone"]),
    purpose: z.enum(["register_verify", "login_verify", "password_reset"]),
    code: z.string().min(4).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
