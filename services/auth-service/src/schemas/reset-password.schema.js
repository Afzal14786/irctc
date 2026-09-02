import {z} from "zod";

export const reset_password_schema = z.object({
    token : z.string().min(1, "reset token is required"),
    password: z.string().min(8, "password must be at least 8 characters"),
    confirm_password: z.string().min(8, "confirm password required"),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
        ctx.addIssue(({
            code: "custom",
            path: ["confirm_password"],
            message: "password do not match"
        }));
    }
});

export default reset_password_schema;