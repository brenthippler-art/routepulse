import type { DeliveryException, IssueCategory, Urgency } from "./types";

export type CategoryFilter = IssueCategory | "all";
export type UrgencyFilter = Urgency | "all";

export interface Filters {
  query: string;
  category: CategoryFilter;
  urgency: UrgencyFilter;
}

export const defaultFilters: Filters = {
  query: "",
  category: "all",
  urgency: "all",
};

export function filterExceptions(
  items: DeliveryException[],
  filters: Filters,
): DeliveryException[] {
  const q = filters.query.trim().toLowerCase();

  return items.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.urgency !== "all" && item.urgency !== filters.urgency) return false;
    if (
      q &&
      !item.stopId.toLowerCase().includes(q) &&
      !item.route.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });
}

export function hasActiveFilters(filters: Filters): boolean {
  return filters.query.trim() !== "" || filters.category !== "all" || filters.urgency !== "all";
}