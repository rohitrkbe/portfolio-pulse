import { memo } from 'react';
import { ChevronRightIcon } from '@/components/ui/Icons';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatPercentage, getReturnColorClass } from '@/helpers/formatters';
import { CLIENTS_TABLE } from '@/constants/ui';
import type { Client } from '@/types';
import { ClientAvatar } from './ClientAvatar';
import { AlertBadge } from './AlertBadge';

function ReturnCell({ value }: { value: number }) {
  return (
    <span className={`font-medium font-numeric text-sm ${getReturnColorClass(value)}`}>
      {formatPercentage(value)}
    </span>
  );
}

function RiskBadge({ profile }: { profile: string }) {
  const map: Record<string, 'conservative' | 'moderate' | 'aggressive'> = {
    Conservative: 'conservative',
    Moderate:     'moderate',
    Aggressive:   'aggressive',
  };
  return <Badge variant={map[profile] ?? 'default'} size="sm">{profile}</Badge>;
}

export interface ClientRowProps {
  client: Client;
  index:  number;
  onClick: (id: string) => void;
}

export const ClientRow = memo(function ClientRow({ client, index, onClick }: ClientRowProps) {
  return (
    <tr
      onClick={() => onClick(client.id)}
      className="group hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
      style={{ height: CLIENTS_TABLE.ROW_HEIGHT }}
    >
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

      <td className="px-4 py-3.5">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-numeric">
          {formatCurrency(client.aum)}
        </span>
      </td>

      <td className="px-4 py-3.5"><ReturnCell value={client.returnOneMonth} /></td>
      <td className="px-4 py-3.5"><ReturnCell value={client.returnYTD} /></td>
      <td className="px-4 py-3.5"><RiskBadge profile={client.riskProfile} /></td>

      <td className="px-4 py-3.5">
        {client.requiresRebalancing
          ? <AlertBadge />
          : <span className="text-xs text-slate-400 dark:text-slate-500">—</span>}
      </td>

      <td className="px-4 py-3.5">
        <ChevronRightIcon className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
      </td>
    </tr>
  );
});
