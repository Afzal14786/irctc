import { AppError } from "@irctc/errors";
import { HTTP_CODES, send_error } from "@irctc/http";

/**
 * Global Express error-handling middleware.
 *
 * This must be registered after all routes and normal
 * middleware.
 *
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

export const error_handler_middleware = (err, req, res, next) => {
  /**
   * Let Express handle errors when the response
   * has already started.
   */

  if (req.headersSend) {
    return next(err);
  }

  const logger = req.log;

  /**
   * --------------------------------------------------
   * Unknown / unexpected error
   * --------------------------------------------------
   *
   * These are programming or infrastructure failures.
   */

  if (!(err instanceof AppError)) {
    logger?.error(
      {
        err,
        request_id: req.id,
        method: req.method,
        url: req.originalUrl ?? req.url,
      },
      "unhandled application error",
    );

    return send_error(res, {
      status_code: HTTP_CODES.INTERNAL_SERVER_ERROR,
      message: "INTERNAL SERVER ERROR",
    });
  }

  /**
   * --------------------------------------------------
   * Known application / operational error
   * --------------------------------------------------
   */

  logger?.warn(
    {
      err,
      request_id: req.id,
      method: req.method,
      url: req.originalUrl ?? req.url,
      status_code: err.status_code,
    },
    "OPERATIONAL APPLICATION ERROR",
  );

  return send_error(res, {
    status_code: err.status_code ?? HTTP_CODES.INTERNAL_SERVER_ERROR,
    status: err.status,
    message: err.message ?? "INTERNAL SERVER ERROR",
  });
};

export default error_handler_middleware;
