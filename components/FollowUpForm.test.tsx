import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FollowUpForm } from "./FollowUpForm";

const ERROR = "Choose a follow-up status before saving.";

describe("FollowUpForm", () => {
  it("blocks an empty submit and moves focus to the invalid field", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<FollowUpForm onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /save follow-up/i }));

    const status = screen.getByLabelText(/follow-up status/i);
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(ERROR);
    expect(status).toHaveFocus();
    expect(status).toHaveAttribute("aria-invalid", "true");
    expect(status).toHaveAccessibleDescription(ERROR);
  });

  it("saves a valid follow-up, trims the note, and announces success", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<FollowUpForm onSave={onSave} />);

    const status = screen.getByLabelText(/follow-up status/i);
    await user.selectOptions(status, "resolved");
    await user.type(screen.getByLabelText(/note/i), "  Customer picked up at depot.  ");
    await user.click(screen.getByRole("button", { name: /save follow-up/i }));

    expect(onSave).toHaveBeenCalledWith("resolved", "Customer picked up at depot.");
    expect(screen.getByRole("status")).toHaveTextContent("Follow-up saved: Resolved.");
    expect(status).toHaveValue("");
  });
});