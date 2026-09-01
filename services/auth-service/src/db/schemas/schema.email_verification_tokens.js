/**
 * @file schema.email_verification_tokens.js
 * @method email_verification_tokens
 * @description this is the file which contains the information of the email verification, it is responsible for checking user's email is verified or not
 *
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import auth_user from "./schema.auth_users.js";

export const email_verification_tokens = pgTable("email_verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => auth_user.id, { onDelete: "cascade" }),
  token_hash: text("token_hash").notNull().unique(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(), // we are going to set the expiry time here
  verified_at: timestamp("verified_at", { withTimezone: true }), // we are going to set the moment user verify the email successfully
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export default email_verification_tokens;
