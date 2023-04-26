import express from "express";
import {
  verifyUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  findAllUsersHandler,
  findUserByIdForClientHandler,
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
import verifyAdmin from "../middleware/verifyAdmin";

const router = express.Router();

router.get("/api/users", verifyAdmin, asyncHandler(findAllUsersHandler));
router.get(
  "/api/user/:id",
  verifyJWT,
  validateSchema(findUserByIdSchema),
  asyncHandler(findUserByIdForClientHandler)
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
router.post(
  "/api/users/reset-password/:id/:passwordResetCode",
  validateSchema(resetPasswordSchema),
  asyncHandler(resetPasswordHandler)
);

export default router;
