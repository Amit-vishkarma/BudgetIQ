import React from 'react';
import { Sparkles, Check, X, Eye, ArrowRight, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const RecommendationCard = ({
  recommendation,
  onAccept,
  onDismiss,
  onReview,
  loading = false,
}) => {
  const {
    _id,
    title,
    department,
    category,
    currentAllocation,
    suggestedAllocation,
    estimatedSavings,
    reason,
    metrics,
    priority,
    status,
  } = recommendation;

  // Priority badge styling
  let priorityClass = 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  if (priority === 'High') {
    priorityClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800';
  } else if (priority === 'Medium') {
    priorityClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  }

  const isPending = status === 'Pending';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 relative flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityClass}`}>
              {priority} Priority
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {department}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {category}
            </span>
          </div>

          <div className="shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-xs border border-emerald-200 dark:border-emerald-800/60">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            <span>Save {formatCurrency(estimatedSavings)}</span>
          </div>
        </div>

        {/* Title & Reason */}
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
          <span>{title}</span>
        </h4>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
          {reason}
        </p>

        {/* Metric Comparison pill */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium block">Current Spend/Cap</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {formatCurrency(currentAllocation)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium block">Target Allocation</span>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              {formatCurrency(suggestedAllocation)}
            </span>
          </div>
          {metrics?.projectedRunRate && (
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Projected Run-rate</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {formatCurrency(metrics.projectedRunRate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="text-slate-400">
          Status:{' '}
          <span
            className={`font-semibold ${
              status === 'Accepted'
                ? 'text-emerald-600'
                : status === 'Dismissed'
                ? 'text-slate-400'
                : 'text-brand-600'
            }`}
          >
            {status}
          </span>
        </div>

        {isPending ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDismiss(_id)}
              disabled={loading}
              title="Dismiss recommendation"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Dismiss</span>
            </button>
            <button
              onClick={() => onReview(_id)}
              disabled={loading}
              title="Mark as reviewed"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>
            <button
              onClick={() => onAccept(_id, true)}
              disabled={loading}
              title="Accept & adjust budget limit"
              className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors flex items-center space-x-1 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Fix</span>
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Action recorded</span>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
