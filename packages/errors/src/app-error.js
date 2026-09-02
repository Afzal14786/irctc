import { HTTP_CODES } from "@irctc/http";

export class AppError extends Error {
    constructor(
        message,
        status_code = HTTP_CODES.INTERNAL_SERVER_ERROR,
        is_operational = true
    ) {
        super(message);

        this.name = this.constructor.name;

        this.status_code = status_code;

        this.status =
            status_code >= 400 && status_code < 500
                ? "FAIL"
                : "ERROR";

        this.is_operational = is_operational;

        Error.captureStackTrace(
            this,
            this.constructor
        );
    }
}
