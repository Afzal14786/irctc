import { AppError } from "@irctc/errors";
import { HTTP_CODES } from "@irctc/http";

/**
 * Handles requests that did not match any route.
 */
export const not_found_middleware = (req, res, next) => {
  return next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      HTTP_CODES.NOT_FOUND,
    ),
  );
};

export default not_found_middleware;
