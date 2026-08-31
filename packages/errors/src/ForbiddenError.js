import { HTTP_CODES } from '@irctc/http';
import { AppError } from './app-error.js';

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden — insufficient permissions') {
    super(message, HTTP_CODES.FORBIDDEN);
  }
}
