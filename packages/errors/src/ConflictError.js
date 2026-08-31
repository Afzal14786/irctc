import { HTTP_CODES } from '@irctc/http';
import { AppError } from './app-error.js';

export class ConflictError extends AppError {
  constructor(message = 'Conflict with current state') {
    super(message, HTTP_CODES.CONFLICT);
  }
}
