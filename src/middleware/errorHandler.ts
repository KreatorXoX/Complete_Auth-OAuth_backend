import { Request, Response, NextFunction } from "express";
import APIError from "../model/http-error";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof APIError) {
    res.status(err.httpCode);
    res.json({ message: err.message });
  } else {
    res.status(500);
    res.json({ message: "Internal server error" });
  }
};

export default errorHandler;
