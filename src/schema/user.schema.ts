import { z } from "zod";

// verifiying user via verification code schema
export const verifyUserSchema = z.object({
  params: z.object({
    id: z.string(),
    verificationCode: z.string(),
  }),
});
export type VerifyUserInput = z.TypeOf<typeof verifyUserSchema>["params"];

// forgot password schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Provide a valid email address" }),
  }),
});

export type ForgotPasswordInput = z.TypeOf<typeof forgotPasswordSchema>["body"];

// reset password schema
export const resetPasswordSchema = z.object({
  params: z.object({
    id: z.string(),
    passwordResetCode: z.string(),
  }),
  body: z
    .object({
      password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Minimum of 6 Chars" }),
      confirmPassword: z
        .string({ required_error: "Confirm password is required" })
        .min(6, { message: "Minimum of 6 Chars" }),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export type ResetPasswordInput = z.TypeOf<typeof resetPasswordSchema>;
