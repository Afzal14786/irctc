import { HTTP_CODES } from '@irctc/http';
import { AppError } from './app-error.js';

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, HTTP_CODES.UNAUTHORIZED);
  }
}
