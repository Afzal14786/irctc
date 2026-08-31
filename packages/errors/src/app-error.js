import {HTTP_CODES} from "@irctc/http";

export class AppError extends Error {
  constructor(message, statusCode = HTTP_CODES.INTERNAL_SERVER_ERROR, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational; 
    Error.captureStackTrace(this, this.constructor);
  }
}
