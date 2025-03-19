export class CustomError extends Error {
    code: any;
    constructor(code, message) {
      super(message);
      this.name = this.constructor.name;
      this.code = code
      Error.captureStackTrace(this, this.constructor);
    }
  }