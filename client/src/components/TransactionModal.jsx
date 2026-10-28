import React, { useState, useEffect } from 'react';
import { X, Upload, IndianRupee, Calendar, Building, Tag, CreditCard, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

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
  'Client Revenue',
  'Subscription Revenue',
  'Consulting Revenue',
  'Other Expense',
];

const PAYMENT_METHODS = [
  'Bank Transfer',
  'Corporate Card',
  'Credit Card',
  'UPI',
  'Vendor Invoice',
  'Cash',
  'Cheque',
  'Other',
];

const TransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  departments = [],
  loading = false,
}) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    vendor: '',
    description: '',
    isRecurring: false,
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || '',
        department: initialData.department || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        paymentMethod: initialData.paymentMethod || 'Bank Transfer',
        vendor: initialData.vendor || '',
        description: initialData.description || '',
        isRecurring: Boolean(initialData.isRecurring),
      });
      setReceiptFile(null);
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: PRESET_CATEGORIES[0],
        department: departments[0]?.name || 'Technology',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        vendor: '',
        description: '',
        isRecurring: false,
      });
      setReceiptFile(null);
    }
    setErrors({});
  }, [initialData, isOpen, departments]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Amount must be greater than zero';
    }
    if (!formData.department) errs.department = 'Department is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.date) errs.date = 'Date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Use FormData if file attached, otherwise plain object
    if (receiptFile) {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      data.append('receipt', receiptFile);
      await onSubmit(data, isEdit ? initialData._id : null);
    } else {
      await onSubmit(formData, isEdit ? initialData._id : null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          {isEdit ? 'Edit Transaction' : 'Record New Transaction'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {isEdit
            ? 'Update the transaction details below. Financial totals will update dynamically.'
            : 'Enter transaction particulars to reflect in business budgets and cashflow analytics.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type Radio Selector */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formData.type === 'expense'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formData.type === 'income'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Income / Revenue
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title / Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AWS Cloud Hosting or Q4 Client Retainer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-0.5">{errors.title}</p>}
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (INR ₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full pl-7 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold ${
                    errors.amount ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-[11px] text-rose-500 mt-0.5">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.date && <p className="text-[11px] text-rose-500 mt-0.5">{errors.date}</p>}
            </div>
          </div>

          {/* Department & Category Grid */}
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
                Category <span className="text-rose-500">*</span>
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

          {/* Vendor & Payment Method Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vendor / Payee
              </label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services, Google, WeWork"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Internal Notes / Reference
            </label>
            <textarea
              rows="2"
              placeholder="Add optional notes, invoice ID, or purchase order number..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Receipt Upload & Recurring Checkbox */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="isRecurring" className="text-xs text-slate-600 dark:text-slate-400">
                Recurring monthly subscription
              </label>
            </div>

            <label className="inline-flex items-center space-x-2 text-xs font-medium text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">
              <Upload className="w-4 h-4" />
              <span>{receiptFile ? receiptFile.name : 'Upload Receipt/Bill'}</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.webp"
                onChange={(e) => setReceiptFile(e.target.files[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          {/* Actions */}
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
              <span>{isEdit ? 'Save Changes' : 'Record Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
