export function AlertBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      Rebalance
    </span>
  );
}
