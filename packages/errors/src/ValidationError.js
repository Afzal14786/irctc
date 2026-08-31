import { HTTP_CODES } from '@irctc/http';
import { AppError } from './app-error.js';

export class ValidationError extends AppError {
  constructor(message = 'Invalid input', details = null) {
    super(message, HTTP_CODES.BAD_REQUEST);
    this.details = details;
  }
}
