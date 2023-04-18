import { Response, Request, NextFunction } from "express";

import HttpError from "../model/http-error";
import { loginUser, registerUser } from "../service/auth.service";
import { LoginUserInput, RegisterUserInput } from "../schema/auth.schema";
import sendEmail from "../utils/mailer";
import { signJwt, verifyJwt } from "../utils/jwt";
import { findUserById } from "../service/user.service";

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  const message = "Invalid password or email! please check your credentials";
  const body = req.body;

  const user = await registerUser(body);

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
    { expiresIn: "25s" }
  );
  const refreshToken = signJwt({ _id: user._id }, "refreshTokenSecret", {
    expiresIn: "2m",
  });

  res.cookie("myRefreshTokenCookie", refreshToken, {
    httpOnly: true,
    secure: true, // make it true when prod.
    sameSite: "none",
    maxAge: 2 * 60 * 1000,
  });

  await sendEmail({
    from: "test@example.com",
    to: user.email,
    subject: "Please verify your account",
    text: `Verification code ${user.verificationCode}, Id:${user._id}`,
    html: `<a href="${process.env.BASE_URL}/users/verify/${user._id}/${user.verificationCode}">Click to Verify your Account</a>`,
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
    return next(
      new HttpError("Verification Error - Please verify your account", 401)
    );
  }
  const match = await user.validatePassword(password);

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
    { expiresIn: "25s" }
  );
  const refreshToken = signJwt({ _id: user._id }, "refreshTokenSecret", {
    expiresIn: "2m",
  });

  res.cookie("myRefreshTokenCookie", refreshToken, {
    httpOnly: true,
    secure: true, // make it true when prod.
    sameSite: "none",
    maxAge: 2 * 60 * 1000,
  });

  res.json({ accessToken });
};

interface RefreshTokenType {
  _id: string;
  exp: number;
  iat: number;
}

export const refreshUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.myRefreshTokenCookie) {
    return next(new HttpError("Unauthorized", 401));
  }

  const refreshToken = cookies.myRefreshTokenCookie as string;

  let decoded;
  try {
    decoded = verifyJwt<RefreshTokenType>(refreshToken, "refreshTokenSecret")!;
  } catch (error) {
    return next(new HttpError("Forbidden Route", 403));
  }

  const user = await findUserById(decoded._id);

  if (!user) return next(new HttpError("Unauthorized", 401));

  const accessToken = signJwt(
    {
      UserInfo: {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    },
    "accessTokenSecret",
    { expiresIn: "25s" }
  );

  res.json({ accessToken });
};

export const logoutUserHandler = (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.myRefreshTokenCookie) {
    res.sendStatus(204);
    return;
  }

  res.clearCookie("myRefreshTokenCookie", {
    httpOnly: true,
    secure: true, // make it true when prod.
    sameSite: "none",
    maxAge: 2 * 60 * 1000,
  });

  res.json({ message: "Cookies cleared" });
};
