export type IssueCategory = "delayed" | "attempted" | "damaged" | "address-issue";
export type Urgency = "low" | "medium" | "high";
export type FollowUpStatus = "open" | "contacted-customer" | "rescheduled" | "resolved";

export interface HistoryEvent {
  at: string;
  note: string;
}

export interface DeliveryException {
  id: string;
  stopId: string;
  route: string;
  scheduledTime: string;
  category: IssueCategory;
  urgency: Urgency;
  status: FollowUpStatus;
  history: HistoryEvent[];
}

export const categoryLabels: Record<IssueCategory, string> = {
  delayed: "Delayed",
  attempted: "Attempted",
  damaged: "Damaged",
  "address-issue": "Address issue",
};

export const urgencyLabels: Record<Urgency, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const statusLabels: Record<FollowUpStatus, string> = {
  open: "Open",
  "contacted-customer": "Contacted customer",
  rescheduled: "Rescheduled",
  resolved: "Resolved",
};