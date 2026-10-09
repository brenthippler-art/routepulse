import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExceptionDashboard } from "./ExceptionDashboard";
import { FollowUpProvider } from "@/lib/follow-up-context";
import { exceptions } from "@/lib/mock-data";

function mockFetchSuccess() {
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(() => Promise.resolve(Response.json(exceptions)));
}

function renderDashboard() {
  return render(
    <FollowUpProvider>
      <ExceptionDashboard />
    </FollowUpProvider>,
  );
}

describe("ExceptionDashboard", () => {
  it("shows a loading state, then the full list of exceptions", async () => {
    mockFetchSuccess();
    renderDashboard();

    expect(screen.getByRole("status")).toHaveTextContent(/loading exceptions/i);

    const table = await screen.findByRole("table");
    // +1 for the header row
    expect(within(table).getAllByRole("row")).toHaveLength(exceptions.length + 1);
    expect(
      screen.getByText(`Showing all ${exceptions.length} exceptions, sorted by scheduled time`),
    ).toBeInTheDocument();
  });

  it("shows an error when the request fails, then recovers on retry", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockImplementation(() => Promise.resolve(Response.json(exceptions)));
    const user = userEvent.setup();
    renderDashboard();

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn.t load exceptions/i);

    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("narrows the list with filters and shows a no-matches state", async () => {
    mockFetchSuccess();
    const user = userEvent.setup();
    renderDashboard();

    const table = await screen.findByRole("table");

    await user.selectOptions(screen.getByLabelText("Urgency"), "high");
    await user.selectOptions(screen.getByLabelText("Issue type"), "damaged");

    const bodyRows = within(table).getAllByRole("row").slice(1);
    expect(bodyRows).toHaveLength(2);
    expect(within(table).getByText("STP-4907")).toBeInTheDocument();
    expect(within(table).getByText("STP-5568")).toBeInTheDocument();
    expect(
      screen.getByText(`Showing 2 of ${exceptions.length} exceptions`),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search"), "zzz");
    expect(
      screen.getByRole("heading", { name: /no exceptions match these filters/i }),
    ).toBeInTheDocument();
  });
});