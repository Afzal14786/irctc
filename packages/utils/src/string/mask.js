/**
 * Masks an email address.
 *
 * Example:
 * afzal@example.com
 * → a***l@example.com
 */
export const mask_email = (email) => {
    if (typeof email !== "string") {
        return email;
    }

    const [local, domain] = email.split("@");

    if (!local || !domain) {
        return email;
    }

    if (local.length <= 2) {
        return `${local[0] ?? ""}***@${domain}`;
    }

    return `${local[0]}***${local.at(-1)}@${domain}`;
};

/**
 * Masks a phone number.
 *
 * Example:
 * 9876543210
 * → ******3210
 */
export const mask_phone = (phone) => {
    if (typeof phone !== "string") {
        return phone;
    }

    if (phone.length <= 4) {
        return "***";
    }

    return `${"*".repeat(
        phone.length - 4,
    )}${phone.slice(-4)}`;
};