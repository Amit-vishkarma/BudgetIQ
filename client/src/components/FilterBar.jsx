import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const FilterBar = ({
  departments = [],
  categories = [],
  selectedDepartment = 'All',
  onDepartmentChange,
  selectedCategory = 'All',
  onCategoryChange,
  selectedType = 'All',
  onTypeChange,
  period,
  onPeriodChange,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
  showType = true,
  showPeriod = true,
  showDateRange = false,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-card mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Filter Records:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter */}
          {departments.length > 0 && (
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d._id || d.name || d} value={d.name || d}>
                  {d.name || d}
                </option>
              ))}
            </select>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Type Filter */}
          {showType && (
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          )}

          {/* Period Filter (e.g. Month) */}
          {showPeriod && (
            <input
              type="month"
              value={period || ''}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          )}

          {/* Date range picker */}
          {showDateRange && onDateRangeChange && (
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <input
                type="date"
                value={startDate || ''}
                onChange={(e) => onDateRangeChange(e.target.value, endDate)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 text-xs"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate || ''}
                onChange={(e) => onDateRangeChange(startDate, e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 text-xs"
              />
            </div>
          )}

          {/* Reset Filters */}
          {onReset && (
            <button
              onClick={onReset}
              title="Reset all filters"
              className="inline-flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
