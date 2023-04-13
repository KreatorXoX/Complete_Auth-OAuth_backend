import express from "express";
import {
  verifyUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  findUserByIdHandler,
  findAllUsers,
} from "../controller/user.controller";
import validateSchema from "../middleware/validateSchema";
import {
  forgotPasswordSchema,
  verifyUserSchema,
  resetPasswordSchema,
  findUserByIdSchema,
} from "../schema/user.schema";
import asyncHandler from "express-async-handler";
import verifyJWT from "../middleware/verifyJWT";

const router = express.Router();

router.get("/api/users", verifyJWT, asyncHandler(findAllUsers));
router.get(
  "/api/user/:id",
  verifyJWT,
  validateSchema(findUserByIdSchema),
  asyncHandler(findUserByIdHandler)
);

router.get(
  "/api/users/verify/:id/:verificationCode",
  validateSchema(verifyUserSchema),
  asyncHandler(verifyUserHandler)
);
router.post(
  "/api/users/forgot-password",
  validateSchema(forgotPasswordSchema),
  asyncHandler(forgotPasswordHandler)
);
router.get(
  "/api/users/reset-password/:id/:passwordResetCode",
  validateSchema(resetPasswordSchema),
  asyncHandler(resetPasswordHandler)
);

export default router;
