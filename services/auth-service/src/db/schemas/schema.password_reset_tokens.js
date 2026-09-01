/**
 * @file password_reset_tokens
 * @method password_reset_tokens
 * @description this contais the password_reset_tokens details when user request for any token for reset password
 */

import { pgTable, timestamp, text, uuid } from "drizzle-orm/pg-core";
import auth_user from "./schema.auth_users.js";

export const password_reset_tokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => auth_user.id, { onDelete: "cascade" }),
  token_hash: text("token_hash").unique().notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  used_at: timestamp("used_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export default password_reset_tokens;
