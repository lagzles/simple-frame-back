import type { AnalysisJob } from "@prisma/client";

export function presentAnalysisJob(job: AnalysisJob) {
  return {
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    currentStep: job.currentStep,
    errorCode: job.errorCode,
    errorMessage: job.errorMessage,
    createdAt: job.createdAt.toISOString(),
    startedAt: job.startedAt?.toISOString() ?? null,
    finishedAt: job.finishedAt?.toISOString() ?? null,
  };
}
