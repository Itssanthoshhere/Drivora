import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config/env";
import rateLimit from "express-rate-limit";
import { logger } from "./utils/logger";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin:
      config.env === "production" ? ["https://yourproductiondomain.com"] : "*",
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
      success: false,
      message: "Too many requests, please try again",
    },
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

app.use((req, _res, next) => {
  logger.debug(`-> ${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Drivora",
    env: config.env,
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port} in ${config.env} mode`);
});
