"use client";

import Link from "next/link";
import type { DeliveryException, FollowUpStatus } from "@/lib/types";
import { categoryLabels, statusLabels, urgencyLabels } from "@/lib/types";
import { formatDateTime, formatTime } from "@/lib/format";
import { applyFollowUps } from "@/lib/follow-ups";
import { useFollowUps } from "@/lib/follow-up-context";
import { UrgencyBadge } from "./UrgencyBadge";
import { FollowUpForm } from "./FollowUpForm";

const tag =
  "inline-flex items-center rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-[13px] font-semibold";

export function ExceptionDetail({ exception }: { exception: DeliveryException }) {
  const { followUps, addFollowUp } = useFollowUps();
  const current = applyFollowUps(exception, followUps[exception.id]);

  function handleSave(status: FollowUpStatus, note: string) {
    addFollowUp(exception.id, { status, note, at: new Date().toISOString() });
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 md:px-10 md:py-6">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-blue-800 hover:underline"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M10 3L5 8L10 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All exceptions
      </Link>

      <div className="flex flex-col gap-3">
        <h1 className="font-mono text-[26px] font-medium md:text-[32px]">{current.stopId}</h1>
        <div className="flex flex-wrap gap-2">
          <UrgencyBadge urgency={current.urgency} />
          <span className={tag}>{categoryLabels[current.category]}</span>
          <span className={tag}>Status: {statusLabels[current.status]}</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[3fr_2fr] md:items-start md:gap-10">
        <div className="flex flex-col gap-8">
          <section aria-labelledby="details-heading" className="flex flex-col gap-4">
            <h2 id="details-heading" className="text-lg font-bold">Details</h2>
            <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-[15px] md:grid-cols-[160px_1fr]">
              <dt className="text-neutral-600">Route</dt>
              <dd>{current.route}</dd>
              <dt className="text-neutral-600">Scheduled</dt>
              <dd><time dateTime={current.scheduledTime}>{formatDateTime(current.scheduledTime)}</time></dd>
              <dt className="text-neutral-600">Issue type</dt>
              <dd>{categoryLabels[current.category]}</dd>
              <dt className="text-neutral-600">Urgency</dt>
              <dd>{urgencyLabels[current.urgency]}</dd>
              <dt className="text-neutral-600">Status</dt>
              <dd>{statusLabels[current.status]}</dd>
              <dt className="text-neutral-600">Exception ID</dt>
              <dd className="font-mono">{current.id}</dd>
            </dl>
          </section>

          <section aria-labelledby="history-heading" className="flex flex-col gap-4">
            <h2 id="history-heading" className="text-lg font-bold">History</h2>
            <ol className="flex flex-col gap-5 border-l-2 border-neutral-300 pl-5">
              {current.history.map((event, i) => (
                <li key={`${event.at}-${i}`} className="relative flex flex-col gap-0.5">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 -left-[27px] size-3 rounded-full border-2 border-neutral-900 bg-white"
                  />
                  <time dateTime={event.at} className="text-sm font-semibold text-neutral-600">
                    {formatTime(event.at)}
                  </time>
                  <p className="text-[15px]">{event.note}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section
          aria-labelledby="follow-up-heading"
          className="flex flex-col gap-5 rounded-lg border-[1.5px] border-neutral-900 p-5 md:p-6"
        >
          <h2 id="follow-up-heading" className="text-lg font-bold">Log follow-up</h2>
          <FollowUpForm onSave={handleSave} />
        </section>
      </div>
    </main>
  );
}