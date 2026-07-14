import { EventEmitter } from "node:events";

export type AnalysisEventName = "queued" | "started" | "progress" | "completed" | "failed" | "cancelled" | "heartbeat";

export type AnalysisEventPayload = {
  jobId: string;
  status: string;
  progress?: number;
  step?: string | null;
  errorCode?: string | null;
  message?: string | null;
  resultsUrl?: string;
};

const emitter = new EventEmitter();
emitter.setMaxListeners(200);

export function publishAnalysisEvent(event: AnalysisEventName, payload: AnalysisEventPayload): void {
  emitter.emit(payload.jobId, event, payload);
}

export function subscribeAnalysisEvents(
  jobId: string,
  listener: (event: AnalysisEventName, payload: AnalysisEventPayload) => void,
): () => void {
  emitter.on(jobId, listener);
  return () => emitter.off(jobId, listener);
}
