/**
 * @file schema.user.js
 * @method users
 * @description this files contains the schema of the user
*/

import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const user_status_enum =  pgEnum("user_status", ["active", "suspended", "banned"]);
export const user_role_enum = pgEnum("role", ["ADMIN", "USER"]);

export const users  = pgTable("users", {
    _id: uuid("_id").primaryKey().defaultRandom(),
    first_name: text("first_name", {length: 50}).notNull(),
    second_name: text("second_name", {length: 50}).notNull(),
    email: text("email", {length: 50}).notNull().unique(),
    password: text("password").notNull(),
    user_status: user_status_enum("user_status").default("active"),
    role: user_role_enum("role").default("USER"),
    created_at: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    updated_at: timestamp("updated_at", {withTimezone: true}).defaultNow().notNull().$onUpdate(() => new Date()),

});

export default users;