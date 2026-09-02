import { AppError } from "@irctc/errors";
import { HTTP_CODES } from "@irctc/http";

export const validate_params = (schema) => {
  if (!schema) {
    throw new Error("validate_params requires a schema");
  }

  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return next(
        new AppError(
          "Request parameters validation failed",
          HTTP_CODES.BAD_REQUEST,
        ),
      );
    }

    req.params = result.data;

    return next();
  };
};

export default validate_params;
