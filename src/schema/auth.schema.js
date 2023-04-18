"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
// creating a new user schema
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstName: zod_1.z.string({ required_error: "First name is required" }),
        lastName: zod_1.z.string({ required_error: "Last name is required" }),
        email: zod_1.z.string().email().nonempty(),
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
// login user in schema
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email().nonempty(),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(6, { message: "Minimum of 6 Chars" }),
    }),
});
