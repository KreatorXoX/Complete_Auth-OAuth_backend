import { z } from "zod";

// creating a new user schema
export const registerUserSchema = z.object({
  body: z
    .object({
      firstName: z.string({ required_error: "First name is required" }),
      lastName: z.string({ required_error: "Last name is required" }),
      email: z.string().email().nonempty(),
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
export type RegisterUserInput = z.TypeOf<typeof registerUserSchema>["body"];

// login user in schema
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email().nonempty(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Minimum of 6 Chars" }),
  }),
});
export type LoginUserInput = z.TypeOf<typeof loginUserSchema>["body"];
