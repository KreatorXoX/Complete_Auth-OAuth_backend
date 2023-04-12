class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: number,
    description: string,
    isOperational: boolean
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export default class APIError extends BaseError {
  constructor(
    name: string,
    httpCode = 500,
    description = "internal server error",
    isOperational = true
  ) {
    super(name, httpCode, description, isOperational);
  }
}
