import { z } from "zod";

export const verify_email_schema = z.object({
    email: z.string().trim().email("invalid email address"),
    otp: z.string().regex(/^\d{6}$/, "otp must be a 6 digit number")
});

export default verify_email_schema;