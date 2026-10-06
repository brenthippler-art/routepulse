import type { IssueCategory, Urgency } from "@/lib/types";
import { categoryLabels, urgencyLabels } from "@/lib/types";
import type { CategoryFilter, Filters, UrgencyFilter } from "@/lib/filters";

const categories = Object.keys(categoryLabels) as IssueCategory[];
const urgencies = Object.keys(urgencyLabels) as Urgency[];

const label = "text-sm font-semibold";
const control =
  "h-11 w-full min-w-0 rounded-md border-[1.5px] border-neutral-900 bg-white px-3 text-base focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-800";

type FilterBarProps = {
  filters: Filters;
  onChange: (next: Filters) => void;
  onClear: () => void;
};

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  return (
    <div
      role="search"
      aria-label="Filter exceptions"
      className="flex flex-col gap-3 rounded-lg bg-neutral-100 p-4 md:flex-row md:items-end md:gap-4 md:p-5"
    >
      <div className="flex flex-col gap-1.5 md:flex-1">
        <label htmlFor="filter-search" className={label}>Search</label>
        <input
          id="filter-search"
          type="search"
          placeholder="Stop ID or route"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          className={control}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
        <div className="flex flex-col gap-1.5 md:w-52">
          <label htmlFor="filter-category" className={label}>Issue type</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) =>
              onChange({ ...filters, category: e.target.value as CategoryFilter })
            }
            className={control}
          >
            <option value="all">All issue types</option>
            {categories.map((c) => (
              <option key={c} value={c}>{categoryLabels[c]}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 md:w-44">
          <label htmlFor="filter-urgency" className={label}>Urgency</label>
          <select
            id="filter-urgency"
            value={filters.urgency}
            onChange={(e) =>
              onChange({ ...filters, urgency: e.target.value as UrgencyFilter })
            }
            className={control}
          >
            <option value="all">All urgencies</option>
            {urgencies.map((u) => (
              <option key={u} value={u}>{urgencyLabels[u]}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="h-11 rounded-md border-[1.5px] border-neutral-900 bg-white px-4 font-semibold hover:bg-neutral-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
      >
        Clear filters
      </button>
    </div>
  );
}