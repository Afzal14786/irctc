/**
 * @file schema.user_profiles.js
 * @method users
 * @description this files contains the schema of the user
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  varchar,
} from "drizzle-orm/pg-core";

import {GENDER_ENUM} from "./enums.js";

export const user_profiles = pgTable("user_profiles", {
  user_id: uuid("user_id").primaryKey().notNull(),
  first_name: varchar("first_name", {length: 50}).notNull(),
  last_name: varchar("last_name", {length: 50}).notNull(),
  phone: varchar("phone", {length: 10}),  // since this is indian railways 
  date_of_birth: date("date_of_birth"),// age must be >= 18 for having an account 
  gender: GENDER_ENUM("gender").notNull(),
  profile_image_url: text("profile_image_url").default(
    "https://res.cloudinary.com/dl9bfojiu/image/upload/v1785015040/leetcode-profile_ot2bwk.jpg",
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});


export default user_profiles