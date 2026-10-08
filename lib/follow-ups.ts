import type { DeliveryException, FollowUpStatus } from "./types";
import { statusLabels } from "./types";

export interface FollowUp {
  status: FollowUpStatus;
  note: string;
  at: string;
}

export function applyFollowUps(
  exception: DeliveryException,
  followUps: FollowUp[] = [],
): DeliveryException {
  if (followUps.length === 0) return exception;

  const latest = followUps[followUps.length - 1];

  return {
    ...exception,
    status: latest.status,
    history: [
      ...exception.history,
      ...followUps.map((f) => ({
        at: f.at,
        note: f.note
          ? `Status set to ${statusLabels[f.status]}. ${f.note}`
          : `Status set to ${statusLabels[f.status]}.`,
      })),
    ],
  };
}