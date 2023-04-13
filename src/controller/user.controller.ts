import { Response, Request, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import {
  ForgotPasswordInput,
  VerifyUserInput,
  ResetPasswordInput,
  FindUserByIdInpupt,
} from "../schema/user.schema";
import {
  findUserById,
  findUserByMail,
  getUsers,
} from "../service/user.service";
import sendEmail from "../utils/mailer";
import HttpError from "../model/http-error";

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // find the user by id and check to see if they are already verified

  const user = await findUserById(id);

  if (!user) {
    return next(new HttpError("Could not verify the user", 500));
  }

  if (user.verified) {
    res.send("User is already verified");
    //return next(new HttpError("User is already verified", 204));
  }

  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    res.send("User verified");
  }

  res.send("Could not verify user");
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
) {
  const message =
    "If a user with the provided email is registered, you will recieve a reset password link";
  const { email } = req.body;

  const user = await findUserByMail(email);

  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  if (!user.verified) {
    return next(new HttpError("User not verified", 400));
  }

  const passwordResetCode = uuidv4();

  user.passwordResetCode = passwordResetCode;
  await user.save();

  await sendEmail({
    to: user.email,
    from: "text@example.com",
    subject: "Reset your password",
    text: `Password reset link : ${passwordResetCode} ${user._id}`,
  });

  res.send(message);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return next(new HttpError("Could not reset the password", 400));
  }

  user.passwordResetCode = null;
  user.password = password;
  await user.save();
  res.send("Successfully updated the password");
}

export async function findAllUsers(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const users = await getUsers();

  if (!users || users?.length < 1) {
    return next(new HttpError("No user is available", 204));
  }

  res.json(users);
}
export async function findUserByIdHandler(
  req: Request<FindUserByIdInpupt, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const user = await findUserById(id);

  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  res.json(user);
}
