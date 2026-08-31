import { HTTP_CODES } from './httpCodes.js';
import { HTTP_STATUS } from './httpStatus.js';

/**
 * Every controller in every service should respond through this —
 * guarantees an identical response shape across the whole backend.
 *
 * @param {import('express').Response} res
 * @param {{ key?: keyof typeof HTTP_CODES, data?: any, message?: string }} opts
 */
export function sendResponse(res, { key = 'OK', data = null, message } = {}) {
  const code = HTTP_CODES[key] ?? HTTP_CODES.OK;
  const status = HTTP_STATUS[key] ?? HTTP_STATUS.OK;
  return res.status(code).json({
    status,
    message: message ?? status,
    data,
  });
}

export function sendError(res, { key = 'INTERNAL_SERVER_ERROR', message } = {}) {
  const code = HTTP_CODES[key] ?? HTTP_CODES.INTERNAL_SERVER_ERROR;
  const status = HTTP_STATUS[key] ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
  return res.status(code).json({
    status,
    message: message ?? status,
  });
}
