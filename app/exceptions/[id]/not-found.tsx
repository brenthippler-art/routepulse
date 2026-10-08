import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 py-10 md:px-10">
      <h1 className="text-2xl font-bold">Exception not found</h1>
      <p className="text-neutral-600">The link may be wrong, or this exception was removed.</p>
      <Link href="/" className="font-semibold text-blue-800 hover:underline">
        Back to all exceptions
      </Link>
    </main>
  );
}