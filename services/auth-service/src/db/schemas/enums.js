/**
 * @file enums.js
 * @method USER_ROLE_ENUM
 * @method USER_STATUS_ENUM
 * @method OAUTH_PROVIDER_ENUM
 * @description this will contains all the enums which is required in the auth service tables
 */

import { pgEnum } from "drizzle-orm/pg-core";

export const USER_ROLE_ENUM = pgEnum("user_role", ["admin", "user"]);
export const USER_STATUS_ENUM = pgEnum("user_status", [
  "active",
  "suspended",
  "banned",
]);
export const OAUTH_PROVIDER_ENUM = pgEnum("provider", [
  "google",
  "facebook",
  "github",
  "local",
]);
