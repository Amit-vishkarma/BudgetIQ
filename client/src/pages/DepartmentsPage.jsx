import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Users,
  User,
  PieChart,
  Edit2,
  Trash2,
  Wallet,
  Receipt,
} from 'lucide-react';
import { departmentService } from '../services/departmentService';
import { formatCurrency } from '../utils/formatters';
import DepartmentModal from '../components/DepartmentModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DepartmentsPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'Admin' || user?.role === 'Finance Manager';

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentService.getDepartments();
      if (res.success) {
        setDepartments(res.departments || []);
      }
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFormSubmit = async (formData, id) => {
    try {
      setActionLoading(true);
      if (id) {
        await departmentService.updateDepartment(id, formData);
        toast.success('Department updated successfully');
      } else {
        await departmentService.createDepartment(formData);
        toast.success('Department created successfully');
      }
      setModalOpen(false);
      setEditingDept(null);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await departmentService.deleteDepartment(deleteId);
      toast.success('Department removed');
      setDeleteId(null);
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to delete department');
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
            Business Departments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage cost centers, department heads, headcount, and budget allocations.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              setEditingDept(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {/* Departments Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
      ) : departments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments found"
          description="Create your company departments to start allocating budgets."
          actionLabel="Create Department"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => {
            const utilization = dept.utilization || 0;
            let statusBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            if (utilization >= 100) statusBadge = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
            else if (utilization >= 90) statusBadge = 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300';
            else if (utilization >= 80) statusBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';

            return (
              <div
                key={dept._id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Code & Color Bar & Actions */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: dept.color || '#2563eb' }}
                      />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                        {dept.code}
                      </span>
                    </div>

                    {canManage && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setEditingDept(dept);
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg transition-colors"
                          title="Edit department"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(dept._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete department"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {dept.description || 'Corporate operations center.'}
                  </p>

                  {/* Metadata pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{dept.head || 'Head Not Assigned'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{dept.teamSize || 1} Team Members</span>
                    </div>
                  </div>

                  {/* Financial Stats */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total Budget Cap</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(dept.totalBudget)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Actual Spend</span>
                      <span className="font-bold text-brand-600">
                        {formatCurrency(dept.totalSpent)}
                      </span>
                    </div>
                  </div>

                  {/* Utilization Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Utilization</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${statusBadge}`}>
                        {utilization}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, utilization)}%`,
                          backgroundColor: dept.color || '#2563eb',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <DepartmentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDept(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingDept}
        loading={actionLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        title="Delete Department"
        message="Are you sure you want to remove this department? Any linked historical records will retain reference."
        confirmLabel="Delete"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />
    </div>
  );
};

export default DepartmentsPage;
