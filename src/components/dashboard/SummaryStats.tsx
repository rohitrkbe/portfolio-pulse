'use client';

import { useSelector } from 'react-redux';
import { selectClientsSummary } from '@/store/slices/clientsSlice';
import StatCard from '@/components/ui/StatCard';
import { UsersIcon, CurrencyRupeeIcon, BellAlertIcon, TrendingUpIcon } from '@/components/ui/Icons';
import { formatCurrency, formatPercentage } from '@/helpers/formatters';
import { STAT_LABELS } from '@/constants/strings';

export default function SummaryStats() {
  const { totalClients, totalAUM, alertCount, avgReturnYTD } = useSelector(selectClientsSummary);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label={STAT_LABELS.TOTAL_CLIENTS}
        value={totalClients}
        icon={UsersIcon}
        accent="blue"
      />
      <StatCard
        label={STAT_LABELS.TOTAL_AUM}
        value={formatCurrency(totalAUM)}
        icon={CurrencyRupeeIcon}
        accent="green"
      />
      <StatCard
        label={STAT_LABELS.REBALANCING_ALERTS}
        value={alertCount}
        subValue={alertCount > 0 ? STAT_LABELS.ALERTS_SOME : STAT_LABELS.ALERTS_NONE}
        icon={BellAlertIcon}
        accent={alertCount > 0 ? 'amber' : 'green'}
      />
      <StatCard
        label={STAT_LABELS.AVG_YTD}
        value={formatPercentage(avgReturnYTD)}
        icon={TrendingUpIcon}
        accent="purple"
      />
    </div>
  );
}
