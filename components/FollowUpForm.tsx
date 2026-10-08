"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import type { FollowUpStatus } from "@/lib/types";
import { statusLabels } from "@/lib/types";

const statusOptions = (Object.keys(statusLabels) as FollowUpStatus[]).filter(
  (s) => s !== "open",
);
const NOTE_LIMIT = 280;

const control =
  "w-full rounded-md border-[1.5px] border-neutral-900 bg-white px-3 text-base focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-800 aria-[invalid=true]:border-[2.5px] aria-[invalid=true]:border-red-800";

type FollowUpFormProps = {
  onSave: (status: FollowUpStatus, note: string) => void;
};

export function FollowUpForm({ onSave }: FollowUpFormProps) {
  const id = useId();
  const statusId = `${id}-status`;
  const errorId = `${id}-status-error`;
  const noteId = `${id}-note`;
  const noteHelpId = `${id}-note-help`;

  const statusRef = useRef<HTMLSelectElement>(null);
  const [status, setStatus] = useState<FollowUpStatus | "">("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status === "") {
      setError("Choose a follow-up status before saving.");
      setSaved("");
      statusRef.current?.focus();
      return;
    }

    onSave(status, note.trim());
    setSaved(`Follow-up saved: ${statusLabels[status]}.`);
    setStatus("");
    setNote("");
    setError(null);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={statusId} className="text-sm font-semibold">
          Follow-up status <span className="font-normal text-neutral-600">(required)</span>
        </label>
        <select
          id={statusId}
          ref={statusRef}
          required
          value={status}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => {
            setStatus(e.target.value as FollowUpStatus | "");
            setError(null);
            setSaved("");
          }}
          className={`${control} h-11`}
        >
          <option value="">Choose a status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
        {error && (
          <p id={errorId} role="alert" className="flex items-center gap-2 text-sm font-semibold text-red-800">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
              <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 4.5V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="8" cy="11.5" r="1" fill="currentColor" />
            </svg>
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={noteId} className="text-sm font-semibold">
          Note <span className="font-normal text-neutral-600">(optional)</span>
        </label>
        <textarea
          id={noteId}
          rows={4}
          maxLength={NOTE_LIMIT}
          value={note}
          aria-describedby={noteHelpId}
          placeholder="What did you do about this stop?"
          onChange={(e) => {
            setNote(e.target.value);
            setSaved("");
          }}
          className={`${control} min-h-28 resize-y py-2.5`}
        />
        <p id={noteHelpId} className="text-[13px] text-neutral-600">
          Up to {NOTE_LIMIT} characters.
        </p>
      </div>

      <button
        type="submit"
        className="h-12 rounded-md bg-blue-800 font-semibold text-white hover:bg-blue-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
      >
        Save follow-up
      </button>

      <p role="status" className="min-h-5 text-sm font-semibold">
        {saved}
      </p>
    </form>
  );
}