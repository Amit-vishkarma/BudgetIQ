import React, { useState, useEffect } from 'react';
import {
  Plus,
  Download,
  Filter,
  Search,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { departmentService } from '../services/departmentService';
import { formatCurrency } from '../utils/formatters';
import { downloadCSV } from '../utils/exportCSV';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
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

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalExpense: 0, totalIncome: 0, netCashflow: 0 });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters, search, pagination, sorting
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
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

  // Fetch transactions with applied filters
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        department: selectedDepartment,
        category: selectedCategory,
        type: selectedType,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      };

      const res = await transactionService.getTransactions(params);
      if (res.success) {
        setTransactions(res.transactions || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, selectedDepartment, selectedCategory, selectedType, startDate, endDate, sortBy, sortOrder, page]);

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  // Create or Update Transaction
  const handleFormSubmit = async (formData, id) => {
    try {
      setActionLoading(true);
      if (id) {
        await transactionService.updateTransaction(id, formData);
        toast.success('Transaction updated successfully');
      } else {
        await transactionService.createTransaction(formData);
        toast.success('Transaction recorded successfully');
      }
      setModalOpen(false);
      setEditingTransaction(null);
      fetchTransactions();
      window.dispatchEvent(new Event('transaction-updated'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Transaction
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await transactionService.deleteTransaction(deleteId);
      toast.success('Transaction deleted');
      setDeleteId(null);
      fetchTransactions();
      window.dispatchEvent(new Event('transaction-updated'));
    } catch (err) {
      toast.error('Failed to delete transaction');
    } finally {
      setActionLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = async () => {
    try {
      toast.loading('Preparing CSV export...', { id: 'csv-toast' });
      const csvData = await transactionService.exportCSV({
        category: selectedCategory,
        department: selectedDepartment,
        type: selectedType,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      const url = window.URL.createObjectURL(new Blob([csvData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV export completed!', { id: 'csv-toast' });
    } catch (err) {
      toast.error('Export failed', { id: 'csv-toast' });
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDepartment('All');
    setSelectedCategory('All');
    setSelectedType('All');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Transactions & Expenses
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete transaction ledger with receipts, sorting, filters, and CSV export.
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
            onClick={() => {
              setEditingTransaction(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Mini Summary Cards for Filtered Set */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Filtered Expense Total
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(summary.totalExpense)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Filtered Income Total
            </span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(summary.totalIncome)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Net Cashflow
            </span>
            <span
              className={`text-xl font-bold ${
                summary.netCashflow >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {summary.netCashflow >= 0 ? '+' : ''}
              {formatCurrency(summary.netCashflow)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by title, description, or vendor name..."
            className="flex-1 w-full"
          />
        </div>

        <FilterBar
          departments={departments}
          categories={PRESET_CATEGORIES}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={(val) => {
            setSelectedDepartment(val);
            setPage(1);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(val) => {
            setSelectedCategory(val);
            setPage(1);
          }}
          selectedType={selectedType}
          onTypeChange={(val) => {
            setSelectedType(val);
            setPage(1);
          }}
          showPeriod={false}
          showDateRange={true}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
            setPage(1);
          }}
          onReset={handleResetFilters}
        />
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-card">
        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : (
          <>
            <TransactionTable
              transactions={transactions}
              onEdit={(tx) => {
                setEditingTransaction(tx);
                setModalOpen(true);
              }}
              onDelete={(id) => setDeleteId(id)}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              canManage={true}
            />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalCount}
              pageSize={10}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
        departments={departments}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        title="Delete Transaction"
        message="Are you sure you want to permanently delete this transaction? This will automatically recalculate department budget utilization and totals."
        confirmLabel="Delete"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />
    </div>
  );
};

export default TransactionsPage;
