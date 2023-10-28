import { AppDataSource } from "@data/data-source";
import express, { type Express } from "express";
import cors from "cors";
import Router from "./routes/index";

async function createApp(): Promise<Express> {
  await AppDataSource.initialize();
  console.log("DataSource initialized...");
  const app = express();
  app.use(cors());

  // Request logging
  app.use(function (req, res, next) {
    const requestStart = Date.now();
    console.log("New request received", { query: req.url });
    res.on("finish", () => {
      console.log(`${req.method}:${req.originalUrl}`, {
        timestamp: Date.now(),
        processingTime: Date.now() - requestStart,
        hostname: req.hostname,
        ip: req.ip,
      });
    });
    next();
  });

  app.use(`/`, Router);
  return app;
}

export default createApp;
