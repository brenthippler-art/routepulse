import Link from "next/link";
import type { DeliveryException } from "@/lib/types";
import { categoryLabels, statusLabels } from "@/lib/types";
import { formatTime } from "@/lib/format";
import { UrgencyBadge } from "./UrgencyBadge";

export function ExceptionCards({ items }: { items: DeliveryException[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={`/exceptions/${item.id}`}
            className="flex flex-col gap-1.5 rounded-lg border-[1.5px] border-neutral-300 px-4 py-3.5 hover:border-neutral-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
          >
            <span className="flex items-center justify-between">
              <span className="font-mono text-[15px]">{item.stopId}</span>
              <UrgencyBadge urgency={item.urgency} />
            </span>
            <span className="text-base font-semibold">
              {categoryLabels[item.category]} · {item.route}
            </span>
            <span className="text-sm text-neutral-600">
              {formatTime(item.scheduledTime)} · {statusLabels[item.status]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}