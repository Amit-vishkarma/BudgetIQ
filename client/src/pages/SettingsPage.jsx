import React, { useState } from 'react';
import { Building, Shield, Bell, DollarSign, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { business, user } = useAuth();
  const [warningThreshold, setWarningThreshold] = useState(
    business?.settings?.budgetWarningThreshold || 80
  );
  const [dangerThreshold, setDangerThreshold] = useState(
    business?.settings?.budgetDangerThreshold || 90
  );
  const [currency, setCurrency] = useState(business?.currency || 'INR');
  const [fiscalYear, setFiscalYear] = useState(business?.fiscalYearStart || 'April');
  const [autoOpt, setAutoOpt] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Organization preferences updated successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          Business Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure corporate entity profiles, currency standards, and automated alert limits.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Information Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-4 h-4 text-brand-600" />
            <span>Organization Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                disabled
                value={business?.name || 'Nexora Cloud Technologies Pvt Ltd'}
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Industry
              </label>
              <input
                type="text"
                disabled
                value={business?.industry || 'Enterprise SaaS & Cloud Infrastructure'}
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Base Operating Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="INR">Indian Rupee (INR ₹)</option>
                <option value="USD">US Dollar (USD $)</option>
                <option value="EUR">Euro (EUR €)</option>
                <option value="GBP">British Pound (GBP £)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fiscal Year Cycle Start
              </label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="April">April (Standard Indian Financial Year)</option>
                <option value="January">January (Calendar Year)</option>
                <option value="July">July (Mid-Year Cycle)</option>
                <option value="October">October (Q4 Cycle)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget Alert Thresholds Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-brand-600" />
            <span>Budget Notification Thresholds</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Early Warning Alert Threshold
                </span>
                <span className="font-bold text-amber-600">{warningThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Dispatches proactive in-app alert when a category approaches this capacity.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Critical Overspend Warning Threshold
                </span>
                <span className="font-bold text-rose-600">{dangerThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                step="5"
                value={dangerThreshold}
                onChange={(e) => setDangerThreshold(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Triggers high-priority dashboard banner and notification when expenses exceed this level.
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoOpt"
                checked={autoOpt}
                onChange={(e) => setAutoOpt(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="autoOpt" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Enable automated background execution for rule-based optimization engine
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
