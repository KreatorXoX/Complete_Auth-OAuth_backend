import { Response, Request, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import {
  ForgotPasswordInput,
  VerifyUserInput,
  ResetPasswordInput,
  FindUserByIdInpupt,
} from "../schema/user.schema";
import {
  findAllUsers,
  findUserById,
  findUserByIdForClient,
  findUserByMail,
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

  const user = await findUserById(id);

  if (!user) {
    return next(new HttpError("Could not verify the user", 500));
  }

  if (user.verified) {
    return next(new HttpError("User already verified", 400));
  }

  if (user.verificationCode !== verificationCode) {
    return next(
      new HttpError("Verification code does not match / expired", 400)
    );
  }

  user.verified = true;
  await user.save();
  res.send(`
   <div>
        <h2>User Verified</h2>
        <br />
        <a href=${process.env.CLIENT_BASE_URL}>click to go to the site</a>
      </div>
  `);
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
    html: `<a href="${process.env.CLIENT_BASE_URL}/reset-password/${user._id}/${user.passwordResetCode}">Click to Reset your Password</a>`,
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

export async function findAllUsersHandler(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const users = await findAllUsers();

  if (!users || users?.length < 1) {
    return next(new HttpError("No user is available", 404));
  }

  res.json(users);
}

export async function findUserByIdForClientHandler(
  req: Request<FindUserByIdInpupt, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const user = await findUserByIdForClient(id);

  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  res.json(user);
}
