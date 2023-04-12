import { Request, Response, NextFunction } from "express";

import { AnyZodObject } from "zod";
import APIError from "../model/http-error";

const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      return next(
        new APIError("Schema Validation Error", 409, `${error.message}`)
      );
    }
  };

export default validateSchema;
