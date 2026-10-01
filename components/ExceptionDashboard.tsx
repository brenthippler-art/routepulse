"use client";

import { useMemo } from "react";
import { useExceptions } from "@/lib/use-exceptions";
import { ExceptionTable } from "./ExceptionTable";
import { ExceptionCards } from "./ExceptionCards";
import { LoadingState, ErrorState, EmptyState } from "./ListStates";

export function ExceptionDashboard() {
  const { state, retry } = useExceptions();

  const sorted = useMemo(
    () =>
      state.status === "success"
        ? [...state.data].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
        : [],
    [state],
  );

  if (state.status === "loading") return <LoadingState />;
  if (state.status === "error") return <ErrorState onRetry={retry} />;
  if (sorted.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-4">
      <p aria-live="polite" className="text-sm text-neutral-600">
        Showing {sorted.length} exceptions, sorted by scheduled time
      </p>
      <div className="hidden md:block">
        <ExceptionTable items={sorted} />
      </div>
      <div className="md:hidden">
        <ExceptionCards items={sorted} />
      </div>
    </div>
  );
}