/** 
 * @file schema.user_addresses.js
 * @method user_addresses
 * @description this method handles the user's addresses
 */

import { pgTable, text, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

import {ADDRESS_LABEL_ENUM} from "./enums.js";
import user_profile from "./schema.user_profiles.js";

export const user_addresses = pgTable("user_addresses", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").notNull().references(() => user_profile.user_id, {onDelete : "cascade"}),
    label: ADDRESS_LABEL_ENUM("label").default("home").notNull(),
    address_line1: text("address_line1").notNull(),
    city: varchar("city", {length: 100}).notNull(),
    state: varchar("state", {length: 100}).notNull(),
    pincode: varchar("pincode", {length : 6}).notNull(),  // this should be only the size of 6, not < 6 and not > 6
    created_at: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    updated_at: timestamp("updated_at", {withTimezone: true}).notNull().defaultNow().$onUpdate(() => new Date())
});

export default user_addresses;