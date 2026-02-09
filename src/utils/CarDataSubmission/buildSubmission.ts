import type { CarSubmissionPayload } from "@/types/CarDataSubmission/carSubmission";
import { deepClean } from "./cleanPayload";

export function buildSubmission(payload: CarSubmissionPayload): CarSubmissionPayload {
  return deepClean(payload);
}