import { AppError } from "@irctc/errors";
import { HTTP_CODES } from "@irctc/http";

/**
 * Validates req.body using a Zod schema.
 */
export const validate_body = (schema) => {
  if (!schema) {
    throw new Error("validate_body requires a schema");
  }

  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError("Request body validation failed", HTTP_CODES.BAD_REQUEST),
      );
    }

    req.body = result.data;

    return next();
  };
};

export default validate_body;
