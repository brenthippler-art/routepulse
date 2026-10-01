export function LoadingState() {
  return (
    <div className="flex flex-col gap-4">
      <p role="status" className="flex items-center gap-2.5 font-semibold">
        <span
          aria-hidden="true"
          className="size-4 rounded-full border-2 border-neutral-300 border-t-blue-800 motion-safe:animate-spin"
        />
        Loading exceptions…
      </p>
      <div aria-hidden="true" className="flex flex-col">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="grid grid-cols-[72px_96px_120px_1fr] items-center gap-4 border-b border-neutral-200 py-4"
          >
            <span className="h-5 rounded-full bg-neutral-200" />
            <span className="h-3 rounded-full bg-neutral-200" />
            <span className="h-3 rounded-full bg-neutral-200" />
            <span className="h-3 w-3/4 rounded-full bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
      <h2 className="text-xl font-bold">Couldn&apos;t load exceptions</h2>
      <p className="text-neutral-600">The server didn&apos;t respond. Try again in a moment.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 h-11 rounded-md bg-blue-800 px-6 font-semibold text-white hover:bg-blue-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
      >
        Try again
      </button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <h2 className="text-xl font-bold">No exceptions to show</h2>
      <p className="text-neutral-600">Every stop on today&apos;s routes is on track.</p>
    </div>
  );
}