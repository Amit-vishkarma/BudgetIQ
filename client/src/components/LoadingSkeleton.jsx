import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-card animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-36 mb-2"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-28"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-card animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-6"></div>
        {items.map((i) => (
          <div key={i} className="flex items-center justify-between space-x-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-card animate-pulse space-y-4">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-64"></div>
      <div className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded-lg"></div>
    </div>
  );
};

export default LoadingSkeleton;
