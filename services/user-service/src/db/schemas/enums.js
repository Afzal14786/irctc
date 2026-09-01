/**
 * @file enums.js
 * @method GENDER_ENUM - this contains gender enums values ["male", "female", "other"]
 * @method ADDRESS_LABEL_ENUM - this contains address label values ["home", "office", "weeken_house"]
 */

import { pgEnum } from "drizzle-orm/pg-core";


export const GENDER_ENUM = pgEnum("gender", ["male", "female", "other"]);
export const ADDRESS_LABEL_ENUM = pgEnum("address_label", ["home", "office", "weekend_house"]);

