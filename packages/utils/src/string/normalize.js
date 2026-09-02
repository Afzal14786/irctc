/**
 * Normalizes an email address.
 */
export const normalize_email = (email) => {
    if (typeof email !== "string") {
        throw new TypeError(
            "email must be a string",
        );
    }

    return email
        .trim()
        .toLowerCase();
};


/**
 * Normalizes a generic string.
 */
export const normalize_string = (value) => {
    if (typeof value !== "string") {
        throw new TypeError(
            "value must be a string",
        );
    }

    return value.trim();
};