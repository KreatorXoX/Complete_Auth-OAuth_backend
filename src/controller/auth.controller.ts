import { Response, Request, NextFunction } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../model/user.model";
import HttpError from "../model/http-error";
import { loginUser } from "../service/auth.service";
import { LoginUserInput, RegisterUserInput } from "../schema/auth.schema";
import sendEmail from "../utils/mailer";
import { signJwt } from "../utils/jwt";

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  const message = "Invalid password or email! please check your credentials";
  const body = req.body;

  const user = await UserModel.create(body);

  if (!user) {
    return next(new HttpError(message, 401));
  }
  const accessToken = signJwt(
    {
      UserInfo: {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    },
    "accessTokenSecret",
    { expiresIn: "30m" }
  );
  const refreshToken = signJwt({ _id: user._id }, "refreshTokenSecret", {
    expiresIn: "7d",
  });

  res.cookie("jwtToken", refreshToken, {
    httpOnly: true,
    secure: false, // make it true when prod.
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  await sendEmail({
    from: "test@example.com",
    to: user.email,
    subject: "Please verify your account",
    text: `Verification code ${user.verificationCode}, Id:${user._id}`,
    html: `<a href="http://localhost:1337/api/users/verify/${user._id}/${user.verificationCode}">Click to Verify your Account</a>`,
  });

  res.json({ accessToken });
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  const message = "Invalid password or email! please check your credentials";
  const { email, password } = req.body;

  const user = await loginUser(email);

  if (!user) {
    return next(new HttpError(message, 401));
  }

  if (!user.verified) {
    return next(new HttpError("Verification Error", 401));
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new HttpError(message, 401));
  }

  const accessToken = signJwt(
    {
      UserInfo: {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    },
    "accessTokenSecret",
    { expiresIn: "30m" }
  );
  const refreshToken = signJwt({ _id: user._id }, "refreshTokenSecret", {
    expiresIn: "7d",
  });

  res.cookie("jwtToken", refreshToken, {
    httpOnly: true,
    secure: false, // make it true when prod.
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};
