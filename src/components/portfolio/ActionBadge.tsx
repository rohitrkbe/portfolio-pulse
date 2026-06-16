import { REBALANCING_ACTIONS } from '@/constants/ui';

interface ActionBadgeProps {
  action: string;
}

export function ActionBadge({ action }: ActionBadgeProps) {
  if (action === REBALANCING_ACTIONS.BUY) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 uppercase tracking-wide">
        Buy
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 uppercase tracking-wide">
      Sell
    </span>
  );
}
