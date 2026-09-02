import { z } from "zod";

export const register_schema = z.object({
    first_name: z.string().min(3, "first name must have 3 characters"),
    last_name: z.string(),
    email: z.string().trim().email("invalid email address"),
    password: z.string().min(8, "password must have 8 character"),
    confirm_password: z.string().min(8, "password must have 8 character"),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
        ctx.addIssue({
            code: "custom",
            path: ["confirm_password"],
            message: "password do not match",
        });
    }
});

export default register_schema;