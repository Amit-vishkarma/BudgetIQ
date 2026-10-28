import React from 'react';
import { formatCurrency, getUtilizationStatus } from '../utils/formatters';

const BudgetProgress = ({
  department,
  category,
  allocated,
  spent,
  showDetails = true,
  className = '',
}) => {
  const remaining = Math.max(0, allocated - spent);
  const overspent = spent > allocated ? spent - allocated : 0;
  const percentage = allocated > 0 ? Number(((spent / allocated) * 100).toFixed(1)) : 0;
  const status = getUtilizationStatus(percentage);

  // Width capped at 100% for progress visual
  const barWidth = Math.min(100, Math.max(0, percentage));

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {department || category}
          </span>
          {category && department && (
            <span className="text-slate-400 dark:text-slate-500">• {category}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {percentage}%
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${status.badgeColor}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
        <div
          className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>
            Spent: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(spent)}</strong>
          </span>
          <span>
            {overspent > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-medium">
                Over by {formatCurrency(overspent)}
              </span>
            ) : (
              <span>
                Remaining: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(remaining)}</strong>
              </span>
            )}
          </span>
          <span>
            Cap: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(allocated)}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
