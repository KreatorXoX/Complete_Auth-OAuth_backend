"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyUserSchema = exports.findUserByIdSchema = void 0;
const zod_1 = require("zod");
// finding user by the provided id schema
exports.findUserByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
// verifiying user via verification code schema
exports.verifyUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
        verificationCode: zod_1.z.string(),
    }),
});
// forgot password schema
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email({ message: "Provide a valid email address" }),
    }),
});
// reset password schema
exports.resetPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
        passwordResetCode: zod_1.z.string(),
    }),
    body: zod_1.z
        .object({
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(6, { message: "Minimum of 6 Chars" }),
        confirmPassword: zod_1.z
            .string({ required_error: "Confirm password is required" })
            .min(6, { message: "Minimum of 6 Chars" }),
    })
        .refine((data) => data.confirmPassword === data.password, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});
