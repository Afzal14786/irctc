import jwt from "jsonwebtoken";

import { AppError } from "@irctc/errors";
import { HTTP_CODES } from "@irctc/http";

/**
 * Creates JWT authentication middleware.
 *
 * @param {Object} options
 * @param {string} options.secret
 * @param {string} [options.issuer]
 * @param {string} [options.audience]
 * @param {string} [options.algorithms]
 *
 * @returns {import("express").RequestHandler}
 */
export const authenticate = ({
  secret,
  issuer,
  audience,
  algorithms = ["HS256"],
}) => {
  if (!secret) {
    throw new Error("authenticate requires a JWT secret");
  }

  return (req, res, next) => {
    try {
      const auth_header = req.headers.authorization;

      if (!auth_header) {
        throw new AppError(
          "Authorization header is required",
          HTTP_CODES.UNAUTHORIZED,
        );
      }

      const [scheme, token] = auth_header.split(" ");

      if (scheme?.toLowerCase() !== "bearer" || !token) {
        throw new AppError(
          "Invalid authorization header format",
          HTTP_CODES.UNAUTHORIZED,
        );
      }

      const verify_options = {
        algorithms,
        ...(issuer ? { issuer } : {}),
        ...(audience ? { audience } : {}),
      };

      const decoded = jwt.verify(token, secret, verify_options);

      if (!decoded || typeof decoded !== "object" || !decoded.sub) {
        throw new AppError("Invalid access token", HTTP_CODES.UNAUTHORIZED);
      }

      req.user = {
        id: decoded.sub,
        role: decoded.role,
        email: decoded.email,
      };

      return next();
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }

      return next(
        new AppError(
          "Invalid or expired access token",
          HTTP_CODES.UNAUTHORIZED,
        ),
      );
    }
  };
};

export default authenticate;
