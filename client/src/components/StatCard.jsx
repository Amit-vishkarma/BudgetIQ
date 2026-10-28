import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  subtitle,
  change,
  isPositiveGood = true,
  icon: Icon,
  iconColor = 'text-brand-600 dark:text-brand-400',
  iconBg = 'bg-brand-50 dark:bg-brand-950/40',
  badge,
}) => {
  const isPositive = typeof change === 'number' && change > 0;
  const isNeutral = typeof change === 'number' && change === 0;

  // Determine change pill colors
  let changeClass = 'text-slate-500 bg-slate-100 dark:bg-slate-800';
  if (!isNeutral && typeof change === 'number') {
    const isGood = isPositiveGood ? isPositive : !isPositive;
    changeClass = isGood
      ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
      : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40';
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor} transition-transform group-hover:scale-105`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2 mb-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {badge && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2 text-xs">
        {typeof change === 'number' && (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-medium ${changeClass}`}>
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ) : isNeutral ? null : (
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
            )}
            {change > 0 ? `+${change}%` : `${change}%`}
          </span>
        )}
        {subtitle && (
          <span className="text-slate-400 dark:text-slate-500 truncate">{subtitle}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
