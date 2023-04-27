import express from "express";

import validateSchema from "../middleware/validateSchema";
import {
  googleOAuthHandler,
  loginUserHandler,
  logoutUserHandler,
  refreshUserHandler,
  registerUserHandler,
} from "../controller/auth.controller";
import { loginUserSchema, registerUserSchema } from "../schema/auth.schema";
import asyncHandler from "express-async-handler";
import loginLimiter from "../middleware/loginLimiter";

const router = express.Router();

router.post(
  "/api/auth/register",
  validateSchema(registerUserSchema),
  asyncHandler(registerUserHandler)
);

router.post(
  "/api/auth/login",
  loginLimiter,
  validateSchema(loginUserSchema),
  asyncHandler(loginUserHandler)
);

router.post("/api/auth/logout", asyncHandler(logoutUserHandler));

router.get("/api/auth/refresh", asyncHandler(refreshUserHandler));

router.get("/api/oauth/google", googleOAuthHandler);
export default router;
