import React, { useState } from 'react';
import {
  FileText,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Eye,
  X,
  CreditCard,
  Building2,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import EmptyState from './EmptyState';

const TransactionTable = ({
  transactions = [],
  onEdit,
  onDelete,
  sortBy = 'date',
  sortOrder = 'desc',
  onSort,
  canManage = true,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  if (!transactions.length) {
    return (
      <EmptyState
        title="No transactions recorded"
        description="Try clearing your search query or filters, or record a new transaction."
      />
    );
  }

  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
    );
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <th
                onClick={() => onSort && onSort('date')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 group"
              >
                <div className="flex items-center space-x-1.5">
                  <span>Date</span>
                  {renderSortIcon('date')}
                </div>
              </th>
              <th className="py-3 px-4">Transaction / Vendor</th>
              <th className="py-3 px-4">Department & Category</th>
              <th className="py-3 px-4">Payment Method</th>
              <th
                onClick={() => onSort && onSort('amount')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 group"
              >
                <div className="flex items-center justify-end space-x-1.5">
                  <span>Amount</span>
                  {renderSortIcon('amount')}
                </div>
              </th>
              <th className="py-3 px-4 text-center">Receipt</th>
              {canManage && <th className="py-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';

              return (
                <tr
                  key={tx._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {formatDate(tx.date)}
                  </td>

                  {/* Title & Vendor */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {tx.title}
                    </div>
                    {tx.vendor && (
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{tx.vendor}</span>
                      </div>
                    )}
                  </td>

                  {/* Department & Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-medium text-[11px]">
                        {tx.department}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {tx.category}
                      </span>
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tx.paymentMethod}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-bold text-sm ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Receipt */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {tx.receiptUrl ? (
                      <button
                        onClick={() => setSelectedReceipt(tx.receiptUrl)}
                        title="View Receipt"
                        className="p-1 rounded-md text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  {canManage && (
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onEdit(tx)}
                          title="Edit transaction"
                          className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(tx._id)}
                          title="Delete transaction"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <span>Attached Bill / Receipt</span>
            </h3>
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center min-h-[280px]">
              {selectedReceipt.endsWith('.pdf') ? (
                <div className="text-center p-6 space-y-3">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">PDF Document Attached</p>
                  <a
                    href={selectedReceipt}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs rounded-lg font-medium"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <img
                  src={selectedReceipt}
                  alt="Receipt"
                  className="max-h-[400px] w-auto object-contain mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionTable;
