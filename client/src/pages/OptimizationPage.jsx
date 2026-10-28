import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ShieldCheck,
  Filter,
  DollarSign,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { optimizationService } from '../services/optimizationService';
import { departmentService } from '../services/departmentService';
import { formatCurrency } from '../utils/formatters';
import RecommendationCard from '../components/RecommendationCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const OptimizationPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState({
    totalPotentialSavings: 0,
    totalRealizedSavings: 0,
    counts: { total: 0, pending: 0, accepted: 0, dismissed: 0, highPriority: 0 },
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

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

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await optimizationService.getRecommendations({
        status: selectedStatus,
        priority: selectedPriority,
        department: selectedDepartment,
      });

      if (res.success) {
        setRecommendations(res.recommendations || []);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedStatus, selectedPriority, selectedDepartment]);

  // Run Optimization Engine Live Analysis
  const handleRunAnalysis = async () => {
    try {
      setGenerating(true);
      toast.loading('Running financial optimization heuristics on transactions & budgets...', {
        id: 'opt-gen',
      });
      const res = await optimizationService.generateRecommendations();
      if (res.success) {
        toast.success(res.message || 'Analysis complete! Generated new recommendations.', {
          id: 'opt-gen',
        });
        fetchRecommendations();
      }
    } catch (err) {
      toast.error('Failed to run optimization analysis', { id: 'opt-gen' });
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = async (id, applyToBudget = true) => {
    try {
      setActionLoading(true);
      await optimizationService.updateStatus(id, 'Accepted', applyToBudget);
      toast.success('Recommendation accepted and applied to budget cap!');
      fetchRecommendations();
      window.dispatchEvent(new Event('transaction-updated'));
    } catch (err) {
      toast.error('Failed to accept recommendation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    try {
      setActionLoading(true);
      await optimizationService.updateStatus(id, 'Dismissed', false);
      toast.success('Recommendation dismissed');
      fetchRecommendations();
    } catch (err) {
      toast.error('Failed to dismiss recommendation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async (id) => {
    try {
      setActionLoading(true);
      await optimizationService.updateStatus(id, 'Reviewed', false);
      toast.success('Recommendation marked as reviewed');
      fetchRecommendations();
    } catch (err) {
      toast.error('Failed to mark reviewed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
              Smart Budget Optimization Engine
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 text-[10px] font-extrabold uppercase tracking-wider">
              Rule-Based AI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent algorithmic analysis analyzing run rates, idle cloud instances, and subscription overlaps.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={generating}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          {generating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>{generating ? 'Analyzing Finances...' : 'Run Optimization Audit'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Potential Monthly Savings
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.totalPotentialSavings)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Across {summary.counts?.pending || 0} pending opportunities
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Realized Savings
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
            {formatCurrency(summary.totalRealizedSavings)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            From {summary.counts?.accepted || 0} applied actions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              High Priority Audits
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {summary.counts?.highPriority || 0}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Requires urgent budget review
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Engine Audit Reliability
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            100%
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Transparent rule-based telemetry
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-card flex flex-wrap items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center space-x-1.5">
          {['Pending', 'Accepted', 'Dismissed', 'All'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Priority & Department Filters */}
        <div className="flex items-center space-x-2.5">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

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
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={`No ${selectedStatus.toLowerCase()} recommendations found`}
          description="Click 'Run Optimization Audit' above to analyze your transactions and detect fresh cost savings."
          actionLabel="Run Optimization Audit"
          onAction={handleRunAnalysis}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec._id}
              recommendation={rec}
              onAccept={handleAccept}
              onDismiss={handleDismiss}
              onReview={handleReview}
              loading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OptimizationPage;
