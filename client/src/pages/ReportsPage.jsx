import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  Calendar,
  Building,
  TrendingUp,
  Receipt,
  PieChart as PieIcon,
  Filter,
  CreditCard,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { reportService } from '../services/reportService';
import { departmentService } from '../services/departmentService';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';
import { downloadCSV } from '../utils/exportCSV';
import ChartCard from '../components/ChartCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const DONUT_COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e', '#64748b'];

const ReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 2);
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Load departments
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await departmentService.getDepartments();
        if (res.success) setDepartments(res.departments || []);
      } catch (err) {
        console.warn('Failed to load departments');
      }
    };
    fetchDepts();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getSummary({
        department: selectedDepartment,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (res.success) {
        setReportData(res);
      }
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedDepartment, startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = async () => {
    try {
      toast.loading('Exporting report data...', { id: 'rep-csv' });
      const res = await reportService.getExpenses({
        department: selectedDepartment,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (res.success && res.transactions) {
        const headers = [
          { label: 'Date', key: (t) => new Date(t.date).toISOString().split('T')[0] },
          { label: 'Title', key: 'title' },
          { label: 'Type', key: 'type' },
          { label: 'Amount (INR)', key: 'amount' },
          { label: 'Category', key: 'category' },
          { label: 'Department', key: 'department' },
          { label: 'Payment Method', key: 'paymentMethod' },
          { label: 'Vendor', key: 'vendor' },
          { label: 'Description', key: 'description' },
        ];
        downloadCSV('corporate_financial_report', res.transactions, headers);
        toast.success('Report downloaded!', { id: 'rep-csv' });
      }
    } catch (err) {
      toast.error('Failed to export report CSV', { id: 'rep-csv' });
    }
  };

  if (loading && !reportData) {
    return <LoadingSkeleton type="card" count={2} />;
  }

  const {
    summary = {},
    categorySummary = [],
    departmentSummary = [],
    paymentMethodSummary = [],
  } = reportData || {};

  return (
    <div className="space-y-6">
      {/* Header and Print/Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Executive Financial Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit cashflow trends, departmental spend distributions, and savings margins.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-card flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Report Scope:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d._id || d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <span>From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 text-xs"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 text-xs"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total Incurred Expenses
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(summary.totalExpense)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {summary.expenseTxCount} billing transactions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total Inflows / Revenue
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.totalIncome)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {summary.incomeTxCount} income events
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Net Surplus / Cashflow
          </span>
          <span
            className={`text-2xl font-bold ${
              summary.netSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
            }`}
          >
            {summary.netSavings >= 0 ? '+' : ''}
            {formatCurrency(summary.netSavings)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Retained capital reserve
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Operating Savings Margin
          </span>
          <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
            {summary.savingsRate}%
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Margin of revenue retained
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid: Category Doughnut & Department Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <ChartCard
          title="Expense Distribution by Category"
          subtitle="Top corporate spending segments across the selected timeframe"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categorySummary.slice(0, 7)}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="total"
              >
                {categorySummary.slice(0, 7).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                }}
                formatter={(val) => [formatCurrency(val), 'Spent']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Comparison Bar */}
        <ChartCard
          title="Department Spend Comparison"
          subtitle="Aggregated expenditures grouped by corporate department"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={departmentSummary}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatCompactCurrency(val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                }}
                formatter={(val) => [formatCurrency(val), 'Total Spend']}
              />
              <Bar dataKey="total" name="Total Expenditure" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Summary Tables for Category & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-card">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Category Breakdown Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-2">Category</th>
                  <th className="pb-2 text-right">Transactions</th>
                  <th className="pb-2 text-right">Total (INR)</th>
                  <th className="pb-2 text-right">Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categorySummary.map((c) => (
                  <tr key={c.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                      {c.category}
                    </td>
                    <td className="py-2.5 text-right text-slate-500">{c.count}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(c.total)}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-brand-600">
                      {c.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-card">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Department Performance Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-2">Department</th>
                  <th className="pb-2 text-right">Transactions</th>
                  <th className="pb-2 text-right">Total (INR)</th>
                  <th className="pb-2 text-right">Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {departmentSummary.map((d) => (
                  <tr key={d.department} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                      {d.department}
                    </td>
                    <td className="py-2.5 text-right text-slate-500">{d.count}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(d.total)}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-brand-600">
                      {d.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
