"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useExceptions } from "@/lib/use-exceptions";
import {
  defaultFilters,
  filterExceptions,
  hasActiveFilters,
  type Filters,
} from "@/lib/filters";
import { FilterBar } from "./FilterBar";
import { ExceptionTable } from "./ExceptionTable";
import { ExceptionCards } from "./ExceptionCards";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  NoMatchesState,
} from "./ListStates";
import { useFollowUps } from "@/lib/follow-up-context";
import { applyFollowUps } from "@/lib/follow-ups";

export function ExceptionDashboard() {
  const { state, retry } = useExceptions();
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const { followUps } = useFollowUps();

  const sorted = useMemo(
    () =>
      state.status === "success"
        ? state.data
            .map((e) => applyFollowUps(e, followUps[e.id]))
            .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
        : [],
    [state, followUps],
  );

  const visible = useMemo(
    () => filterExceptions(sorted, filters),
    [sorted, filters],
  );
  const filtered = hasActiveFilters(filters);
  const clearFilters = () => setFilters(defaultFilters);

  let countText = "";
  if (state.status === "success" && sorted.length > 0) {
    const noun = visible.length === 1 ? "exception" : "exceptions";
    countText = filtered
      ? `Showing ${visible.length} of ${sorted.length} ${noun}`
      : `Showing all ${sorted.length} exceptions, sorted by scheduled time`;
  }

  let region: ReactNode;
  if (state.status === "loading") {
    region = <LoadingState />;
  } else if (state.status === "error") {
    region = <ErrorState onRetry={retry} />;
  } else if (sorted.length === 0) {
    region = <EmptyState />;
  } else if (visible.length === 0) {
    region = <NoMatchesState onClear={clearFilters} />;
  } else {
    region = (
      <>
        <div className="hidden md:block">
          <ExceptionTable items={visible} />
        </div>
        <div className="md:hidden">
          <ExceptionCards items={visible} />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
      />
      <p aria-live="polite" className="min-h-5 text-sm text-neutral-600">
        {countText}
      </p>
      {region}
    </div>
  );
}
