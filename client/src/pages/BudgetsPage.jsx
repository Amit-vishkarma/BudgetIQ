import React, { useState, useEffect } from 'react';
import {
  Plus,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Calendar,
  Building,
  Edit2,
  Trash2,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { budgetService } from '../services/budgetService';
import { departmentService } from '../services/departmentService';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';
import BudgetProgress from '../components/BudgetProgress';
import BudgetModal from '../components/BudgetModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ChartCard from '../components/ChartCard';
import { useAuth } from '../context/AuthContext';
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
];

const BudgetsPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'Admin' || user?.role === 'Finance Manager';

  const now = new Date();
  const currentPeriodStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [period, setPeriod] = useState(currentPeriodStr);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [departments, setDepartments] = useState([]);

  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({
    totalAllocated: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overallUtilization: 0,
  });
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const [bRes, compRes] = await Promise.all([
        budgetService.getBudgets({
          period,
          department: selectedDepartment,
          category: selectedCategory,
        }),
        budgetService.getComparison({ period }),
      ]);

      if (bRes.success) {
        setBudgets(bRes.budgets || []);
        if (bRes.summary) setSummary(bRes.summary);
      }
      if (compRes.success) {
        setComparisonData(compRes.comparison || []);
      }
    } catch (err) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [period, selectedDepartment, selectedCategory]);

  const handleFormSubmit = async (formData, id) => {
    try {
      setActionLoading(true);
      if (id) {
        await budgetService.updateBudget(id, formData);
        toast.success('Budget allocation updated');
      } else {
        await budgetService.createBudget(formData);
        toast.success('Budget allocated successfully');
      }
      setModalOpen(false);
      setEditingBudget(null);
      fetchBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save budget allocation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await budgetService.deleteBudget(deleteId);
      toast.success('Budget allocation deleted');
      setDeleteId(null);
      fetchBudgets();
    } catch (err) {
      toast.error('Failed to delete budget allocation');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Budget Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Allocate departmental funds, establish spending caps, and monitor threshold utilization.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {canManage && (
            <button
              onClick={() => {
                setEditingBudget(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Allocate Budget</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total Allocated Cap
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(summary.totalAllocated)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Across {budgets.length} budget lines
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Actual Spent
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(summary.totalSpent)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Real expenditures recorded
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Remaining Capital
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.totalRemaining)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Unused departmental funds
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Overall Utilization
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
              {summary.overallUtilization}%
            </span>
            <span
              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                summary.overallUtilization >= 90
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : summary.overallUtilization >= 80
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {summary.overallUtilization >= 90 ? 'Critical' : summary.overallUtilization >= 80 ? 'Warning' : 'Healthy'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Target benchmark: &lt;85%
          </span>
        </div>
      </div>

      {/* Planned vs Actual Comparison Bar Chart */}
      <ChartCard
        title="Planned vs Actual Budget Comparison by Department"
        subtitle="Visualizing variance between planned allocations and real transaction outflows"
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
            <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactCurrency(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#fff',
                borderRadius: '12px',
                border: 'none',
                fontSize: '12px',
              }}
              formatter={(v) => [formatCurrency(v), '']}
            />
            <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
            <Bar dataKey="planned" name="Planned Cap" fill="#93c5fd" radius={[6, 6, 0, 0]} />
            <Bar dataKey="actual" name="Actual Spent" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filter Budget Allocations:</span>
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

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Categories</option>
            {PRESET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Detailed Budget Allocations Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Department & Category Budgets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Allocated caps, live expenditures, remaining amounts, and utilization progress
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : budgets.length === 0 ? (
          <EmptyState
            title="No budgets found for this period"
            description="Create your first budget allocation to establish spending limits."
            actionLabel={canManage ? "Allocate Budget" : undefined}
            onAction={canManage ? () => setModalOpen(true) : undefined}
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800/80">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Department & Category</th>
                  <th className="py-3 px-4 text-right">Allocated Cap</th>
                  <th className="py-3 px-4 text-right">Actual Spent</th>
                  <th className="py-3 px-4 text-right">Remaining</th>
                  <th className="py-3 px-4 min-w-[180px]">Utilization</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  {canManage && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {budgets.map((b) => {
                  let badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                  let statusText = 'Normal';
                  if (b.status === 'exceeded') {
                    badgeClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
                    statusText = 'Exceeded';
                  } else if (b.status === 'critical') {
                    badgeClass = 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300';
                    statusText = 'Critical';
                  } else if (b.status === 'warning') {
                    badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                    statusText = 'Warning';
                  }

                  return (
                    <tr
                      key={b._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {b.category}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1">
                          <span className="font-medium text-brand-600 dark:text-brand-400">
                            {b.department}
                          </span>
                          {b.notes && <span>• {b.notes}</span>}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {formatCurrency(b.allocatedAmount)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {formatCurrency(b.spent)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {b.overspent > 0 ? (
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            -{formatCurrency(b.overspent)}
                          </span>
                        ) : (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(b.remaining)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                b.status === 'exceeded'
                                  ? 'bg-rose-500'
                                  : b.status === 'critical'
                                  ? 'bg-orange-500'
                                  : b.status === 'warning'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, b.utilization)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-xs w-10 text-right">
                            {b.utilization}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                          {statusText}
                        </span>
                      </td>

                      {canManage && (
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingBudget(b);
                                setModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit budget"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteId(b._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete budget"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingBudget}
        departments={departments}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        title="Delete Budget Allocation"
        message="Are you sure you want to remove this spending cap allocation? This will delete the budget limit target for this department and period."
        confirmLabel="Delete"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />
    </div>
  );
};

export default BudgetsPage;
