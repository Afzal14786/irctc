/**
 * @file schema.auth_users.js
 * @module auth_users
 * @description this file contains the schema design of the authenicatin.
 */

import { pgTable, uuid, boolean, timestamp, text } from "drizzle-orm/pg-core";

import { USER_ROLE_ENUM } from "./enums.js";
import { USER_STATUS_ENUM } from "./enums.js";

export const auth_users = pgTable("auth_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  password_hashed: text("password_hashed"),
  is_email_verified: boolean("is_email_verified").default(false).notNull(),
  user_role: USER_ROLE_ENUM("role").default("user"),
  user_status: USER_STATUS_ENUM("user_status").default("active").notNull(),
  last_login_at: timestamp("last_login_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export default auth_users;
