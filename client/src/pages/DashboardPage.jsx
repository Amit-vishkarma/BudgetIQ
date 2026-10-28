import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Receipt,
  PiggyBank,
  TrendingUp,
  Percent,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Filter,
  Plus,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { dashboardService } from '../services/dashboardService';
import { departmentService } from '../services/departmentService';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import BudgetProgress from '../components/BudgetProgress';
import TransactionTable from '../components/TransactionTable';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DONUT_COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e', '#64748b'];

const DashboardPage = () => {
  const { business } = useAuth();

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [period, setPeriod] = useState(currentMonthStr);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [departments, setDepartments] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [sumRes, trendRes, catRes, deptRes] = await Promise.all([
        dashboardService.getSummary({ period, department: selectedDepartment }),
        dashboardService.getExpenseTrends({ months: 6 }),
        dashboardService.getCategoryBreakdown({ period, department: selectedDepartment }),
        departmentService.getDepartments(),
      ]);

      if (sumRes.success) setSummaryData(sumRes);
      if (trendRes.success) setTrendData(trendRes.timeline || []);
      if (catRes.success) setCategoryBreakdown(catRes.breakdown || []);
      if (deptRes.success) setDepartments(deptRes.departments || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    const handleUpdate = () => loadDashboard();
    window.addEventListener('transaction-updated', handleUpdate);
    return () => window.removeEventListener('transaction-updated', handleUpdate);
  }, [period, selectedDepartment]);

  if (loading && !summaryData) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="stat" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LoadingSkeleton type="card" />
          </div>
          <div>
            <LoadingSkeleton type="card" />
          </div>
        </div>
      </div>
    );
  }

  const {
    summary = {},
    departmentStats = [],
    alerts = [],
    topCategories = [],
    recentTransactions = [],
    topRecommendations = [],
  } = summaryData || {};

  return (
    <div className="space-y-6">
      {/* Page Header with Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Financial Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time corporate expense tracking, departmental allocations, and savings intelligence.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d._id || d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Month selector */}
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>
      </div>

      {/* Critical Alerts Banner (if any department is over 80%/90%/100%) */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/60 shadow-sm">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide mb-1">
                Active Budget Alerts ({alerts.length})
              </h4>
              <div className="space-y-1">
                {alerts.slice(0, 2).map((alt) => (
                  <p key={alt.id} className="text-xs text-amber-800 dark:text-amber-300">
                    • {alt.message}
                  </p>
                ))}
              </div>
            </div>
            <Link
              to="/budgets"
              className="text-xs font-semibold text-amber-900 dark:text-amber-300 hover:underline shrink-0"
            >
              Manage Budgets →
            </Link>
          </div>
        </div>
      )}

      {/* Primary 5 Key Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Budget */}
        <StatCard
          title="Total Allocated Budget"
          value={formatCurrency(summary.totalBudget)}
          subtitle="Monthly limit across departments"
          icon={Wallet}
          iconColor="text-brand-600 dark:text-brand-400"
          iconBg="bg-brand-50 dark:bg-brand-950/40"
        />

        {/* Total Expenses */}
        <StatCard
          title="Total Month Expenses"
          value={formatCurrency(summary.totalExpenses)}
          change={summary.momChangePercentage}
          isPositiveGood={false} // higher expense is red
          subtitle="vs. previous month"
          icon={Receipt}
          iconColor="text-slate-700 dark:text-slate-300"
          iconBg="bg-slate-100 dark:bg-slate-800"
        />

        {/* Remaining Budget */}
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(summary.remainingBudget)}
          subtitle="Available for allocation"
          icon={PiggyBank}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />

        {/* Monthly Savings */}
        <StatCard
          title="Monthly Net Savings"
          value={formatCurrency(summary.monthlySavings)}
          subtitle="Surplus retained"
          icon={TrendingUp}
          iconColor="text-savings-600 dark:text-savings-500"
          iconBg="bg-savings-50 dark:bg-savings-950/40"
        />

        {/* Budget Utilization % */}
        <StatCard
          title="Budget Utilization"
          value={`${summary.budgetUtilization || 0}%`}
          subtitle={summary.budgetUtilization > 90 ? 'Critical cap reached' : 'Healthy operating band'}
          badge={summary.budgetUtilization > 100 ? 'Over Cap' : summary.budgetUtilization > 85 ? 'Watch' : 'Safe'}
          icon={Percent}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
        />
      </div>

      {/* Main Charts Section: Spending Trend & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Spending vs Budget Line/Area Chart */}
        <ChartCard
          title="Monthly Spending Velocity & Budget"
          subtitle="6-Month historical comparison of expenses versus budget limit in INR"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={290}>
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                formatter={(value) => [formatCurrency(value), '']}
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Actual Spend"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#expenseGradient)"
              />
              <Area
                type="monotone"
                dataKey="budget"
                name="Budget Cap"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#budgetGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Right 1 Col: Category-wise Expense Doughnut Chart */}
        <ChartCard
          title="Expense by Category"
          subtitle="Top expense distributions for current period"
        >
          {categoryBreakdown.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No category expense recorded for this period
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="amount"
                  >
                    {categoryBreakdown.slice(0, 6).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                      />
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
                </PieChart>
              </ResponsiveContainer>

              {/* Mini Category Legend pills */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 w-full text-[11px]">
                {categoryBreakdown.slice(0, 4).map((cat, idx) => (
                  <div key={cat.category} className="flex items-center space-x-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                    />
                    <span className="truncate text-slate-600 dark:text-slate-400">
                      {cat.category}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                      {cat.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Second Row: Department Allocation Bar Chart & Department Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Budget Allocation vs Actual Spend Bar Chart */}
        <ChartCard
          title="Department Allocation vs Actual Spend"
          subtitle="Side-by-side comparison of planned budget vs real expenditure"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={departmentStats}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                formatter={(val) => [formatCurrency(val), '']}
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
              <Bar dataKey="allocated" name="Budget Limit" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="spent" name="Actual Spend" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Utilization Progress Bars */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Department Utilization
              </h3>
              <Link to="/budgets" className="text-xs font-semibold text-brand-600 hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {departmentStats.slice(0, 4).map((d) => (
                <BudgetProgress
                  key={d.id}
                  department={d.name}
                  allocated={d.allocated}
                  spent={d.spent}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400">
              Thresholds: <strong className="text-emerald-600">&lt;80%</strong> Safe •{' '}
              <strong className="text-amber-600">80-90%</strong> Warning •{' '}
              <strong className="text-rose-600">&gt;90%</strong> Critical
            </span>
          </div>
        </div>
      </div>

      {/* Smart Optimization Teaser Banner & Cards */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold uppercase tracking-wider border border-brand-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Optimization Engine</span>
            </span>
            <h3 className="text-lg font-bold">Actionable Expense Reduction Recommendations</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Transparent rule-based cost audits analyzing idle cloud reserves, duplicate software seats, and high-burn categories.
            </p>
          </div>

          <Link
            to="/optimization"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all shadow-md shrink-0 self-start md:self-auto"
          >
            <span>Review All Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Top 2 recommendation highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {topRecommendations.map((rec) => (
            <div
              key={rec._id}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 text-xs space-y-2 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-300 font-semibold text-[10px] uppercase">
                  {rec.priority} Priority
                </span>
                <span className="font-bold text-emerald-400">
                  Save {formatCurrency(rec.estimatedSavings)}/mo
                </span>
              </div>
              <p className="font-semibold text-white text-sm">{rec.title}</p>
              <p className="text-slate-300 text-[11px] line-clamp-2">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Recent Transactions Ledger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest financial activities logged in the corporate account
            </p>
          </div>
          <Link
            to="/transactions"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:underline"
          >
            <span>View all transactions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TransactionTable
          transactions={recentTransactions}
          canManage={false}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
