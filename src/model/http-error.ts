class HttpError extends Error {
  public readonly code: number;
  constructor(message: string, errorCode: number) {
    super(message); //Adds message property
    this.code = errorCode;
  }
}
export default HttpError;
