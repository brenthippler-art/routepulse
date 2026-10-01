import type { Urgency } from "@/lib/types";
import { urgencyLabels } from "@/lib/types";

const styles: Record<Urgency, string> = {
  high: "bg-neutral-900 text-white border-[1.5px] border-neutral-900",
  medium: "border-[1.5px] border-neutral-900 text-neutral-900",
  low: "border-[1.5px] border-dashed border-neutral-500 text-neutral-700",
};

function UrgencyIcon({ urgency }: { urgency: Urgency }) {
  if (urgency === "high") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M6 1L11 10.5H1Z" fill="currentColor" />
      </svg>
    );
  }
  if (urgency === "medium") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M6 1.2L10.8 6L6 10.8L1.2 6Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${styles[urgency]}`}
    >
      <UrgencyIcon urgency={urgency} />
      {urgencyLabels[urgency]}
    </span>
  );
}