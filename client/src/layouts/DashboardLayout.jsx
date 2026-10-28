import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TransactionModal from '../components/TransactionModal';
import { departmentService } from '../services/departmentService';
import { transactionService } from '../services/transactionService';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const navigate = useNavigate();

  // Load departments for shared modals
  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getDepartments();
      if (data.success) {
        setDepartments(data.departments || []);
      }
    } catch (err) {
      console.warn('Failed to load departments in layout:', err.message);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateTransaction = async (formData) => {
    try {
      setLoadingModal(true);
      const res = await transactionService.createTransaction(formData);
      if (res.success) {
        toast.success('Transaction recorded successfully!');
        setIsAddTransactionOpen(false);
        // Refresh page or trigger custom event so active pages refresh data
        window.dispatchEvent(new Event('transaction-updated'));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record transaction');
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Navbar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onSubmit={handleCreateTransaction}
        departments={departments}
        loading={loadingModal}
      />
    </div>
  );
};

export default DashboardLayout;
