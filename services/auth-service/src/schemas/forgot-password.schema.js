import {z} from "zod";

export const forgot_password_schema = z.object({
    email: z.string().trim().email("invalid email address")
});

export default forgot_password_schema;