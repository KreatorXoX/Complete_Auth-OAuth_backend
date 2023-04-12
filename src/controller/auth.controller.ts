import { Response, Request, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { LoginUserInput, RegisterUserInput } from "../schema/auth.schema";
import { loginUser, registerUser } from "../service/auth.service";
import sendEmail from "../utils/mailer";
import APIError from "../model/http-error";
import { signJwt } from "../utils/jwt";

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  const message = "Invalid password or email! please check your credentials";
  const body = req.body;

  const user = await registerUser(body);
  if (!user) {
    return next(new APIError("Registration Error", 401, message));
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
  console.log(user);
  if (!user) {
    return next(new APIError("Validation Error", 401, message));
  }

  if (!user.verified) {
    return next(new APIError("Verification Error", 401, "User not verified"));
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new APIError("Validation Error", 401, message));
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
