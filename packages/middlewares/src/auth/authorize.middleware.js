import { AppError } from "@irctc/errors";
import { HTTP_CODES } from "@irctc/http";

/**
 * Restricts access to one or more roles.
 *
 * @example
 *
 * authorize("admin")
 *
 * authorize("admin", "moderator")
 */
export const authorize = (...allowed_roles) => {
  if (allowed_roles.length === 0) {
    throw new Error("authorize requires at least one role");
  }

  return (req, res, next) => {
    const user_role = req.user?.role;

    if (!user_role) {
      return next(
        new AppError(
          "Access Forbidden: User role not defined",
          HTTP_CODES.FORBIDDEN,
        ),
      );
    }

    if (!allowed_roles.includes(user_role)) {
      return next(
        new AppError(
          "Access Forbidden: Insufficient permissions",
          HTTP_CODES.FORBIDDEN,
        ),
      );
    }

    return next();
  };
};

export default authorize;
