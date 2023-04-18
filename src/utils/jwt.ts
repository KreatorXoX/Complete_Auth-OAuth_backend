import jwt from "jsonwebtoken";
import config from "../config/default";

export function signJwt(
  object: Object,
  keyName: "accessTokenSecret" | "refreshTokenSecret",
  options?: jwt.SignOptions | undefined
) {
  const signingKey = config[keyName];

  return jwt.sign(object, signingKey, {
    ...(options && options),
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenSecret" | "refreshTokenSecret"
): T | null {
  const verifyKey = config[keyName];

  try {
    const decoded = jwt.verify(token, verifyKey) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
