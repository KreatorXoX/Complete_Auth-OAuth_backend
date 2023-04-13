import jwt from "jsonwebtoken";
import config from "config";

import HttpError from "../model/http-error";

export function signJwt(
  object: Object,
  keyName: "accessTokenSecret" | "refreshTokenSecret",
  options?: jwt.SignOptions | undefined
) {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  return jwt.sign(object, signingKey, {
    ...(options && options),
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenSecret" | "refreshTokenSecret"
): T {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (e) {
    throw new HttpError("Jwt verify Error", 500);
  }
}
