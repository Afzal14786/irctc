import { randomInt } from "node:crypto";

/**
 * Generates a cryptographically secure numeric OTP.
 *
 * @param {number} length
 * @returns {string}
 */
export const generate_otp = (length = 6) => {
    if (
        !Number.isInteger(length) ||
        length < 4 ||
        length > 10
    ) {
        throw new Error(
            "OTP length must be between 4 and 10",
        );
    }

    const minimum = 10 ** (length - 1);
    const maximum = 10 ** length;

    return String(
        randomInt(minimum, maximum),
    );
};