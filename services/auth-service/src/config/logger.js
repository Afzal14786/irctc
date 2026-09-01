import {create_logger} from "@irctc/logger";
import { env } from "./env.js";


export const logger = create_logger({
    service_name: env.AUTH_SERVICE,
    version: "1.0.0"
});

export default logger;