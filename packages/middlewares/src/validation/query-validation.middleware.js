import { AppError } from "@irctc/errors";
import { HTTP_CODES } from "@irctc/http";

export const validate_query = (schema) => {
  if (!schema) {
    throw new Error("validate_query requires a schema");
  }

  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(
        new AppError("Request query validation failed", HTTP_CODES.BAD_REQUEST),
      );
    }

    req.query = result.data;

    return next();
  };
};

export default validate_query;
