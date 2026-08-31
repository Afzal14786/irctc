/**
 * @file load.env.js
 * @method env 
 * @description 
 * 
 *      Global Environment Configuration
 */

import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Current file:
 *
 * backend/packages/config/src/load.env.js
 *
 * Go up:
 *
 * src       → config
 * config    → packages
 * packages  → backend
 */
const rootEnvPath = path.resolve(__dirname, "../../../.env");

dotenv.config({
  path: rootEnvPath,
});