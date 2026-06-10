'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectFilteredSortedClients, selectClientsLoading, selectClientsError } from '@/store/slices/clientsSlice';
import { fetchClients } from '@/store/thunks/clientsThunks';
import { ChevronRightIcon } from '@/components/ui/Icons';
import Badge from '@/components/ui/Badge';
import { SectionLoader } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/EmptyState';
import { formatCurrency, formatPercentage, getReturnColorClass } from '@/lib/formatters';
import { ERROR_STRINGS, TABLE_HEADERS } from '@/lib/strings';

function AlertBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      Rebalance
    </span>
  );
}

function ReturnCell({ value }) {
  return (
    <span className={`font-medium font-numeric text-sm ${getReturnColorClass(value)}`}>
      {formatPercentage(value)}
    </span>
  );
}

function RiskBadge({ profile }) {
  const map = {
    Conservative: 'conservative',
    Moderate: 'moderate',
    Aggressive: 'aggressive',
  };
  return <Badge variant={map[profile] ?? 'default'} size="sm">{profile}</Badge>;
}

const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-sky-600',
];

function ClientAvatar({ name, index }) {
  const initials = name.split(' ').map((n) => n[0]).join('');
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  return (
    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}>
      <span className="text-xs font-bold text-white">{initials}</span>
    </div>
  );
}

const HEADERS = [
  TABLE_HEADERS.CLIENT,
  TABLE_HEADERS.AUM,
  TABLE_HEADERS.RETURN_1M,
  TABLE_HEADERS.RETURN_YTD,
  TABLE_HEADERS.RISK,
  TABLE_HEADERS.STATUS,
  '',
];

export default function ClientsTable() {
  const dispatch = useDispatch();
  const router = useRouter();
  const clients = useSelector(selectFilteredSortedClients);
  const loading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);

  if (loading) return <SectionLoader message="Loading client portfolios…" />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchClients())} />;
  if (clients.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{ERROR_STRINGS.NO_CLIENTS}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-0">
      <table className="w-full min-w-[780px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {HEADERS.map((h, i) => (
              <th
                key={`${h}-${i}`}
                className={`py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap ${
                  i === 0 ? 'pl-6 pr-4' : i === HEADERS.length - 1 ? 'px-4' : 'px-4'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {clients.map((client, index) => (
            <tr
              key={client.id}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              className="row-animate group hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
              style={{ '--row-delay': `${index * 45}ms` }}
            >
              {/* Client name + avatar */}
              <td className="pl-6 pr-4 py-3.5">
                <div className="flex items-center gap-3">
                  <ClientAvatar name={client.name} index={index} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {client.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{client.clientId}</p>
                  </div>
                </div>
              </td>

              {/* AUM */}
              <td className="px-4 py-3.5">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-numeric">
                  {formatCurrency(client.aum)}
                </span>
              </td>

              {/* 1M Return */}
              <td className="px-4 py-3.5">
                <ReturnCell value={client.returnOneMonth} />
              </td>

              {/* YTD Return */}
              <td className="px-4 py-3.5">
                <ReturnCell value={client.returnYTD} />
              </td>

              {/* Risk Profile */}
              <td className="px-4 py-3.5">
                <RiskBadge profile={client.riskProfile} />
              </td>

              {/* Status */}
              <td className="px-4 py-3.5">
                {client.requiresRebalancing ? (
                  <AlertBadge />
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                )}
              </td>

              {/* Chevron */}
              <td className="px-4 py-3.5">
                <ChevronRightIcon className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
