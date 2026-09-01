/**
 * @file schema.refresh_tokens.js
 * @method refresh_tokens
 * @description this files contains all the attributes related to refresh tokens
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import auth_users from "./schema.auth_users.js";

export const refresh_tokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => auth_users.id, { onDelete: "cascade" }),
  token_hash: text("token_hash").notNull().unique(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export default refresh_tokens;
