import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { buildingRouter } from "./modules/buildings/building.routes.js";
import { analysisRouter } from "./modules/analysis/analysis.routes.js";
import { loadCaseRouter } from "./modules/load-cases/load-case.routes.js";
import { frameRouter } from "./modules/frames/frame.routes.js";
import { modulationRouter } from "./modules/modulations/modulation.routes.js";
import { projectRouter } from "./modules/projects/project.routes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/projects", projectRouter);
  app.use("/api/buildings", buildingRouter);
  app.use("/api", loadCaseRouter);
  app.use("/api", frameRouter);
  app.use("/api", modulationRouter);
  app.use("/api/analysis-jobs", analysisRouter);

  app.use(errorHandler);

  return app;
}
