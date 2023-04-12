import express from "express";
import {
  verifyUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "../controller/user.controller";
import validateSchema from "../middleware/validateSchema";
import {
  forgotPasswordSchema,
  verifyUserSchema,
  resetPasswordSchema,
} from "../schema/user.schema";

const router = express.Router();

router.get(
  "/api/users/verify/:id/:verificationCode",
  validateSchema(verifyUserSchema),
  verifyUserHandler
);
router.post(
  "/api/users/forgot-password",
  validateSchema(forgotPasswordSchema),
  forgotPasswordHandler
);
router.get(
  "/api/users/reset-password/:id/:passwordResetCode",
  validateSchema(resetPasswordSchema),
  resetPasswordHandler
);

export default router;
