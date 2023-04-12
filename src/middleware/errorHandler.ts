import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code ? (err.code === 11000 ? 400 : err.code) : 500);
  res.json({ message: err.message || "An unknown error occurred!" });
};

export default errorHandler;
