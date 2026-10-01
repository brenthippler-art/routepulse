import Link from "next/link";
import type { DeliveryException } from "@/lib/types";
import { categoryLabels, statusLabels } from "@/lib/types";
import { formatTime } from "@/lib/format";
import { UrgencyBadge } from "./UrgencyBadge";

const th =
  "border-b-2 border-neutral-900 px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-wide text-neutral-600";
const td = "border-b border-neutral-300 px-4 py-3";

export function ExceptionTable({ items }: { items: DeliveryException[] }) {
  return (
    <table className="w-full border-collapse text-[15px]">
      <thead>
        <tr>
          <th scope="col" className={th}>Urgency</th>
          <th scope="col" className={th}>Stop</th>
          <th scope="col" className={th}>Route</th>
          <th scope="col" className={th}>Scheduled</th>
          <th scope="col" className={th}>Issue</th>
          <th scope="col" className={th}>Status</th>
          <th scope="col" className={th}>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td className={td}><UrgencyBadge urgency={item.urgency} /></td>
            <td className={`${td} font-mono`}>{item.stopId}</td>
            <td className={td}>{item.route}</td>
            <td className={td}>
              <time dateTime={item.scheduledTime}>{formatTime(item.scheduledTime)}</time>
            </td>
            <td className={td}>{categoryLabels[item.category]}</td>
            <td className={td}>{statusLabels[item.status]}</td>
            <td className={td}>
              <Link
                href={`/exceptions/${item.id}`}
                className="font-semibold text-blue-800 underline-offset-2 hover:underline"
              >
                View details<span className="sr-only"> for {item.stopId}</span>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}