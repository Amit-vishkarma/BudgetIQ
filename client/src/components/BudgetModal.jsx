import React, { useState, useEffect } from 'react';
import { X, IndianRupee, Layers, Tag, Calendar } from 'lucide-react';

const PRESET_CATEGORIES = [
  'Cloud Infrastructure & Servers',
  'Software Licenses & Tooling',
  'Hardware & Workstations',
  'Digital Ads & Performance',
  'Conferences & Sponsorships',
  'Content & Freelancers',
  'Office Rent & Facilities',
  'Corporate Utilities & Internet',
  'Legal & Accounting Audits',
  'Client Travel & Entertainment',
  'CRM & Lead Intelligence',
  'Sales Commissions & Incentives',
  'Recruitment & Job Portals',
  'Employee Health & Benefits',
  'Team Offsites & Culture',
  'Other Expense',
];

const BudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  departments = [],
  loading = false,
}) => {
  const isEdit = Boolean(initialData);

  const now = new Date();
  const currentPeriodStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    department: '',
    category: '',
    allocatedAmount: '',
    period: currentPeriodStr,
    periodType: 'monthly',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        department: initialData.department || '',
        category: initialData.category || '',
        allocatedAmount: initialData.allocatedAmount || '',
        period: initialData.period || currentPeriodStr,
        periodType: initialData.periodType || 'monthly',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        department: departments[0]?.name || 'Technology',
        category: PRESET_CATEGORIES[0],
        allocatedAmount: '',
        period: currentPeriodStr,
        periodType: 'monthly',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, departments]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.department) errs.department = 'Department is required';
    if (!formData.category) errs.category = 'Category is required';
    if (formData.allocatedAmount === '' || Number(formData.allocatedAmount) < 0) {
      errs.allocatedAmount = 'Allocated amount must be zero or positive';
    }
    if (!formData.period) errs.period = 'Period is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(
      {
        ...formData,
        allocatedAmount: Number(formData.allocatedAmount),
      },
      isEdit ? initialData._id : null
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          {isEdit ? 'Update Budget Allocation' : 'Create Budget Allocation'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Set spending caps for business departments and operational categories to monitor utilization.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Department & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id || d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-[11px] text-rose-500 mt-0.5">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expense Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select Category</option>
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-rose-500 mt-0.5">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Amount & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Allocated Cap (INR ₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="e.g. 250000"
                  value={formData.allocatedAmount}
                  onChange={(e) => setFormData({ ...formData, allocatedAmount: e.target.value })}
                  className={`w-full pl-7 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold ${
                    errors.allocatedAmount ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.allocatedAmount && (
                <p className="text-[11px] text-rose-500 mt-0.5">{errors.allocatedAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Budget Period (Month) <span className="text-rose-500">*</span>
              </label>
              <input
                type="month"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.period && (
                <p className="text-[11px] text-rose-500 mt-0.5">{errors.period}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Rationale / Budget Scope Notes
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Includes primary production clusters and testing databases..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-sm flex items-center space-x-2"
            >
              {loading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{isEdit ? 'Update Budget' : 'Allocate Budget'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
