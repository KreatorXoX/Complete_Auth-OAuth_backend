import { Response, Request, NextFunction } from "express";
import { CreateUserInput } from "../schema/user.schema";

export async function createUser(
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  const body = req.body;
}
