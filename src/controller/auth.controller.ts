import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import HttpError from "../model/http-error";
import { loginUser, registerUser } from "../service/auth.service";
import { LoginUserInput, RegisterUserInput } from "../schema/auth.schema";
import sendEmail from "../utils/mailer";
import { signJwt, verifyJwt } from "../utils/jwt";
import {
  findAndUpdateUser,
  findUserById,
  getGoogleOAuthTokens,
} from "../service/user.service";

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
  // const accessToken = signJwt(
  //   {
  //     UserInfo: {
  //       _id: user._id,
  //       email: user.email,
  //       isAdmin: user.isAdmin,
  //     },
  //   },
  //   "accessTokenSecret",
  //   { expiresIn: "25s" }
  // );
  // const refreshToken = signJwt({ _id: user._id }, "refreshTokenSecret", {
  //   expiresIn: "2m",
  // });

  // res.cookie("myRefreshTokenCookie", refreshToken, {
  //   httpOnly: true,
  //   secure: true, // make it true when prod.
  //   sameSite: "none",
  //   maxAge: 2 * 60 * 1000,
  // });

  await sendEmail({
    from: "test@example.com",
    to: user.email,
    subject: "Please verify your account",
    text: `Verification code ${user.verificationCode}, Id:${user._id}`,
    html: `<a href="${process.env.BASE_URL}/users/verify/${user._id}/${user.verificationCode}">Click to Verify your Account</a>`,
  });

  //res.json({ accessToken });
  res.status(200).json({ message: "Please verify your account now!" });
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

interface GoogleUser {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: Number;
  exp: Number;
}
export const googleOAuthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.query.code as string;

    const { id_token } = await getGoogleOAuthTokens({ code });

    const decodedUser = jwt.decode(id_token) as JwtPayload & GoogleUser;

    if (!decodedUser.email_verified) {
      return next(new HttpError("Account is not verified", 400));
    }

    const user = await findAndUpdateUser(
      {
        email: decodedUser.email,
      },
      {
        email: decodedUser.email,
        firstName: decodedUser.given_name || decodedUser.name.split(" ")[0],
        lastName: decodedUser.family_name || decodedUser.name.split(" ")[1],
        verified: true,
        isAdmin: false,
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (!user) {
      return next(new HttpError("Error registering the google user", 400));
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

    res.redirect(
      `${process.env.CLIENT_BASE_URL!}/oauth/success?accessToken=${accessToken}`
    );
  } catch (error) {
    console.log(error);
    res.redirect(`${process.env.CLIENT_BASE_URL!}/oauth/error`);
  }
};
