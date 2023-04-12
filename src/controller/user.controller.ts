import { Response, Request } from "express";
import { v4 as uuidv4 } from "uuid";

import {
  ForgotPasswordInput,
  VerifyUserInput,
  ResetPasswordInput,
} from "../schema/user.schema";
import { findUserById, findUserByMail } from "../service/user.service";
import sendEmail from "../utils/mailer";

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // find the user by id and check to see if they are already verified

  const user = await findUserById(id);

  if (!user) {
    return res.send("Could not verify user");
  }

  if (user.verified) {
    return res.send("User is already verified");
  }

  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    return res.send("User verified");
  }

  res.send("Could not verify user");
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const message =
    "If a user with the provided email is registered, you will recieve a reset password link";
  const { email } = req.body;

  const user = await findUserByMail(email);

  if (!user) {
    console.log(`${email} doesnt exist`);
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("User is not verified");
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

  return res.send(message);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not reset the password");
  }

  user.passwordResetCode = null;
  user.password = password;
  await user.save();
  return res.send("Successfully updated the password");
}
