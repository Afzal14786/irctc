/**
 * @file schema.passenger_profiles.js
 * @method passenger_profiles
 * @description this is the file only contains details of the passenges to fast track the booking
 */

import { pgEnum, pgTable, text, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import user_profile from "./schema.user_profiles.js";

import {GENDER_ENUM} from "./enums.js";

export const passenger_profiles = pgTable("passenger_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user_profile.user_id, { onDelete: "cascade" }),
  name: text("name").notNull(), // full name of the pessanges {the user_profile holds the name of the user {first name + last name}}
  age: integer("age"),  // if the age is 
  gender: GENDER_ENUM("gender"),
  created_at: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
  updated_at: timestamp("updated_at", {withTimezone: true}).defaultNow().notNull().$onUpdate(() => new Date())
});

export default passenger_profiles;
