import React, { useState, useEffect } from 'react';
import { X, Building2, User, Users, Palette, FileText } from 'lucide-react';

const COLOR_OPTIONS = [
  { label: 'Blue', value: '#2563eb' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Indigo', value: '#6366f1' },
];

const DepartmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: '',
    teamSize: '1',
    color: '#2563eb',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        head: initialData.head || '',
        teamSize: String(initialData.teamSize || 1),
        color: initialData.color || '#2563eb',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        head: '',
        teamSize: '5',
        color: '#2563eb',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Department name is required';
    if (!formData.code.trim()) errs.code = 'Department code is required';
    if (Number(formData.teamSize) < 1) errs.teamSize = 'Team size must be at least 1';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(
      {
        ...formData,
        teamSize: Number(formData.teamSize),
      },
      isEdit ? initialData._id : null
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          {isEdit ? 'Edit Department' : 'Create Business Department'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Configure organizational units to group corporate expenses and budget limits.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Technology, Operations"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    name: val,
                    code: formData.code || val.slice(0, 4).toUpperCase(),
                  });
                }}
                className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="TECH"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono uppercase ${
                  errors.code ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.code && <p className="text-[11px] text-rose-500 mt-0.5">{errors.code}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department Head
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.head}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Team Size
              </label>
              <input
                type="number"
                min="1"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Chart & Badge Accent Color
            </label>
            <div className="flex items-center space-x-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c.value })}
                  style={{ backgroundColor: c.value }}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    formData.color === c.value
                      ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Responsibilities
            </label>
            <textarea
              rows="2"
              placeholder="Primary charter and operational responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

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
              <span>{isEdit ? 'Save Changes' : 'Create Department'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
