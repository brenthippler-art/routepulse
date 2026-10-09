import { describe, expect, it } from "vitest";
import { exceptions } from "./mock-data";
import { defaultFilters, filterExceptions } from "./filters";
import { applyFollowUps } from "./follow-ups";

describe("filterExceptions", () => {
  it("matches search against stop ID and route, ignoring case and spaces", () => {
    const results = filterExceptions(exceptions, { ...defaultFilters, query: "  bg-east " });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((e) => e.route === "BG-East 07")).toBe(true);
  });
});

describe("applyFollowUps", () => {
  it("applies the latest status without mutating the original exception", () => {
    const original = exceptions[0];
    const updated = applyFollowUps(original, [
      { status: "contacted-customer", note: "", at: "2026-10-01T10:00:00-05:00" },
      { status: "resolved", note: "Delivered.", at: "2026-10-01T11:00:00-05:00" },
    ]);

    expect(updated.status).toBe("resolved");
    expect(updated.history).toHaveLength(original.history.length + 2);
    expect(original.status).toBe("open");
  });
});