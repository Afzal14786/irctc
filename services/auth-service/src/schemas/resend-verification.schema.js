import {z} from "zod";

export const resend_verification_email_schema = z.object({
    email: z.string().trim().email("invalid email address")
});

export default resend_verification_email_schema;