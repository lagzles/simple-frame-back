import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { createAnalysisJobSchema } from "./analysis.schemas.js";
import * as analysisService from "./analysis.service.js";
import { presentAnalysisJob } from "./analysis.presenter.js";
import { subscribeAnalysisEvents } from "./analysis-events.js";
import { getStringParam } from "../../utils/params.js";

export const analysisRouter = Router();

analysisRouter.use(requireAuth);

analysisRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createAnalysisJobSchema.parse(req.body);
    const job = await analysisService.createAnalysisJob(req.user!.id, input);
    res.status(201).json({
      jobId: job.id,
      status: job.status,
      eventsUrl: `/api/analysis-jobs/${job.id}/events`,
      statusUrl: `/api/analysis-jobs/${job.id}`,
      resultsUrl: `/api/analysis-jobs/${job.id}/results`,
    });
  }),
);

analysisRouter.get(
  "/:jobId",
  asyncHandler(async (req, res) => {
    const jobId = getStringParam(req.params.jobId, "jobId");
    const job = await analysisService.getOwnedAnalysisJob(req.user!.id, jobId);
    res.json(presentAnalysisJob(job));
  }),
);

analysisRouter.get(
  "/:jobId/results",
  asyncHandler(async (req, res) => {
    const jobId = getStringParam(req.params.jobId, "jobId");
    const results = await analysisService.getAnalysisResults(req.user!.id, jobId);
    res.json(results);
  }),
);

analysisRouter.get(
  "/:jobId/events",
  asyncHandler(async (req, res) => {
    const jobId = getStringParam(req.params.jobId, "jobId");
    const job = await analysisService.getOwnedAnalysisJob(req.user!.id, jobId);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    writeEvent(res, "progress", {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      step: job.currentStep,
    });

    const unsubscribe = subscribeAnalysisEvents(job.id, (event, payload) => {
      writeEvent(res, event, payload);
      if (event === "completed" || event === "failed" || event === "cancelled") {
        unsubscribe();
        res.end();
      }
    });

    const heartbeat = setInterval(() => {
      writeEvent(res, "heartbeat", {
        jobId: job.id,
        status: "running",
      });
    }, 15000);

    req.on("close", () => {
      clearInterval(heartbeat);
      unsubscribe();
      res.end();
    });
  }),
);

function writeEvent(res: { write: (chunk: string) => void }, event: string, data: unknown): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}
