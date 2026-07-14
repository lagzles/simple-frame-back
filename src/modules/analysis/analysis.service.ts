import type { AnalysisJob } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { conflict, notFound } from "../../lib/api-error.js";
import type { CreateAnalysisJobInput } from "./analysis.schemas.js";
import { publishAnalysisEvent } from "./analysis-events.js";

const steps = [
  "loading_snapshot",
  "generating_frame_model",
  "building_load_cases",
  "mounting_global_stiffness_matrix",
  "solving_displacements",
  "recovering_member_forces",
  "building_combinations",
  "checking_profiles",
  "saving_results",
] as const;

export async function createAnalysisJob(userId: string, input: CreateAnalysisJobInput): Promise<AnalysisJob> {
  const building = await prisma.building.findFirst({
    where: {
      id: input.buildingId,
      userId,
    },
    include: {
      modulations: {
        include: {
          frames: {
            include: {
              nodes: true,
              members: true,
              loadCases: true,
            },
          },
        },
      },
    },
  });

  if (!building) {
    throw notFound("Predio nao encontrado.");
  }

  if (input.projectId && building.projectId !== input.projectId) {
    throw notFound("Projeto nao encontrado para este predio.");
  }

  const frames = building.modulations.flatMap((modulation) => modulation.frames);
  const selectedFrame = input.frameId ? frames.find((frame) => frame.id === input.frameId) : frames[0];

  if (input.frameId && !selectedFrame) {
    throw notFound("Portico nao encontrado.");
  }

  const job = await prisma.analysisJob.create({
    data: {
      userId,
      projectId: input.projectId ?? building.projectId,
      buildingId: building.id,
      frameId: selectedFrame?.id,
      status: "queued",
      progress: 0,
      currentStep: "queued",
      snapshot: {
        create: {
          schemaVersion: "2026-07-14",
          inputJson: {
            building,
            frame: selectedFrame ?? null,
            options: input.options,
            units: {
              geometry: "m",
              surfaceLoads: "kgf/m2",
            },
          },
        },
      },
    },
  });

  publishAnalysisEvent("queued", {
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    step: job.currentStep,
  });

  queueAnalysisJob(job.id);

  return job;
}

export async function getOwnedAnalysisJob(userId: string, jobId: string): Promise<AnalysisJob> {
  const job = await prisma.analysisJob.findFirst({
    where: {
      id: jobId,
      userId,
    },
  });

  if (!job) {
    throw notFound("Analise nao encontrada.");
  }

  return job;
}

export async function getAnalysisResults(userId: string, jobId: string) {
  const job = await prisma.analysisJob.findFirst({
    where: {
      id: jobId,
      userId,
    },
    include: {
      result: true,
      memberResults: true,
      reactions: true,
      checks: true,
    },
  });

  if (!job) {
    throw notFound("Analise nao encontrada.");
  }

  if (job.status !== "completed" || !job.result) {
    throw conflict("ANALYSIS_NOT_COMPLETED", "A analise ainda nao foi concluida.", {
      status: job.status,
      progress: job.progress,
    });
  }

  return {
    jobId: job.id,
    status: job.status,
    summary: job.result.summaryJson,
    members: job.checks,
    reactions: job.reactions,
    displacements: job.memberResults,
  };
}

function queueAnalysisJob(jobId: string): void {
  setTimeout(() => {
    void runAnalysisJob(jobId);
  }, 0);
}

async function runAnalysisJob(jobId: string): Promise<void> {
  try {
    await prisma.analysisJob.update({
      where: { id: jobId },
      data: {
        status: "running",
        progress: 1,
        currentStep: "loading_snapshot",
        startedAt: new Date(),
      },
    });

    publishAnalysisEvent("started", {
      jobId,
      status: "running",
      progress: 1,
      step: "loading_snapshot",
    });

    for (const [index, step] of steps.entries()) {
      const progress = Math.round(((index + 1) / steps.length) * 95);
      await delay(120);
      await prisma.analysisJob.update({
        where: { id: jobId },
        data: {
          progress,
          currentStep: step,
        },
      });
      publishAnalysisEvent("progress", {
        jobId,
        status: "running",
        progress,
        step,
      });
    }

    await prisma.analysisResult.create({
      data: {
        analysisJobId: jobId,
        schemaVersion: "2026-07-14",
        summaryJson: {
          criticalMemberKey: null,
          maxEluRatio: null,
          maxElsRatio: null,
          maxDisplacement: null,
          processingTimeMs: null,
          status: "completed_without_calculation_engine",
        },
      },
    });

    await prisma.analysisJob.update({
      where: { id: jobId },
      data: {
        status: "completed",
        progress: 100,
        currentStep: "completed",
        finishedAt: new Date(),
      },
    });

    publishAnalysisEvent("completed", {
      jobId,
      status: "completed",
      progress: 100,
      step: "completed",
      resultsUrl: `/api/analysis-jobs/${jobId}/results`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha inesperada.";
    await prisma.analysisJob.update({
      where: { id: jobId },
      data: {
        status: "failed",
        errorCode: "ANALYSIS_JOB_FAILED",
        errorMessage: message,
        finishedAt: new Date(),
      },
    });
    publishAnalysisEvent("failed", {
      jobId,
      status: "failed",
      errorCode: "ANALYSIS_JOB_FAILED",
      message,
    });
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
