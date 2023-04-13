import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";
import HttpError from "../model/http-error";

interface AuthenticatedRequest extends Request {
  user?: string;
  isAdmin?: boolean;
}

interface AccessTokenType {
  UserInfo: {
    _id: string;
    email: string;
    isAdmin: boolean;
  };
  exp: number;
  iat: number;
}

const verifyJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization || (req.headers.Authorization as string);

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new HttpError("Unauthorized", 401));
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwt<AccessTokenType>(
      accessToken,
      "accessTokenSecret"
    );
    req.user = decoded.UserInfo._id;
    req.isAdmin = decoded.UserInfo.isAdmin;
    next();
  } catch (error) {
    return next(new HttpError("Forbidden", 403));
  }
};

export default verifyJWT;
