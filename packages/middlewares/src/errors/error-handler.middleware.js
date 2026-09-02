import { AppError } from "@irctc/errors";

import { HTTP_CODES, API_STATUS, send_error } from "@irctc/http";

/**
 * Global Express error handler.
 *
 * MUST be registered after all routes and normal middleware.
 */
export const error_handler_middleware = (err, req, res, next) => {
  /**
   * Delegate to Express if the response has already
   * started.
   */
  if (res.headersSent) {
    return next(err);
  }

  const logger = req.log;

  /**
   * -----------------------------------------------
   * Operational/application error
   * -----------------------------------------------
   */
  if (err instanceof AppError) {
    logger?.warn(
      {
        err,
        request_id: req.id,
        method: req.method,
        url: req.originalUrl ?? req.url,
        status_code: err.statusCode,
      },
      "Operational application error",
    );

    return send_error(res, {
      status_code: err.statusCode ?? HTTP_CODES.INTERNAL_SERVER_ERROR,

      status: err.status ?? API_STATUS.ERROR,

      message: err.message,
    });
  }

  /**
   * -----------------------------------------------
   * Unexpected error
   * -----------------------------------------------
   */
  logger?.error(
    {
      err,
      request_id: req.id,
      method: req.method,
      url: req.originalUrl ?? req.url,
    },
    "Unhandled application error",
  );

  return send_error(res, {
    status_code: HTTP_CODES.INTERNAL_SERVER_ERROR,

    status: API_STATUS.ERROR,

    message: "Internal server error",
  });
};

export default error_handler_middleware;
