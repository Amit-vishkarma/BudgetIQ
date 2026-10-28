import React from 'react';

const ChartCard = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="flex-1 w-full min-h-[260px]">{children}</div>
    </div>
  );
};

export default ChartCard;
