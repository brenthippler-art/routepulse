import { ExceptionDashboard } from "@/components/ExceptionDashboard";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-10 md:py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold md:text-[28px]">Delivery exceptions</h1>
        <p className="text-neutral-600">Today&apos;s problem stops across all routes</p>
      </div>
      <ExceptionDashboard />
    </main>
  );
}