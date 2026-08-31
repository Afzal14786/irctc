import { HTTP_CODES } from '@irctc/http';
import { AppError } from './app-error.js';

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HTTP_CODES.NOT_FOUND);
  }
}
