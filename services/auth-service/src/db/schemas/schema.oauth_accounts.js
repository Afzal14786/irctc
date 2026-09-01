/**
 * @file oauth_accounts.js
 * @method oauth_accounts
 * @description this file handles the oauth_accounts manamenges
 */

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import auth_user from "./schema.auth_users.js";

export const OAUTH_PROVIDER_ENUM = pgEnum("provider", [
  "google",
  "facebook",
  "github",
  "local",
]);

export const oauth_accounts = pgTable(
  "oauth_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => auth_user.id, { onDelete: "cascade" }),
    provider: OAUTH_PROVIDER_ENUM("provider").default("local").notNull(), // when user signup using email and password so we'll set this local
    provider_user_id: text("provider_user_id").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("oauth_provider_user_unique").on(
      table.provider,
      table.provider_user_id,
    ),
  ],
);

export default oauth_accounts;
