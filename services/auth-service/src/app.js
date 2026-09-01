import express from "express";

import logger from "./config/logger.js";
import { request_logger_middleware } from "@irctc/logger";

const app = express();

app.use(express.json());
app.use(request_logger_middleware(logger));

app.get("/", (req, res) => {
    res.send(`Hello from authentication service darling`);
});


export default app;