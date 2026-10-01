export function SiteHeader() {
  return (
    <header className="flex h-14 items-center border-b border-neutral-300 px-4 md:h-16 md:px-10">
      <div className="flex items-baseline gap-4">
        <span className="text-lg font-bold md:text-xl">RoutePulse</span>
        <span className="hidden text-sm text-neutral-600 md:inline">Dispatch dashboard</span>
      </div>
    </header>
  );
}