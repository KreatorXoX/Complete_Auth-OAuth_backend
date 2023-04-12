import express from "express";

import validateSchema from "../middleware/validateSchema";
import {
  loginUserHandler,
  registerUserHandler,
} from "../controller/auth.controller";
import { loginUserSchema, registerUserSchema } from "../schema/auth.schema";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.post(
  "/api/auth/register",
  validateSchema(registerUserSchema),
  asyncHandler(registerUserHandler)
);

router.post(
  "/api/auth/login",
  validateSchema(loginUserSchema),
  asyncHandler(loginUserHandler)
);
export default router;
