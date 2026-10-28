/**
 * Financial and Date formatting utilities
 */

// Formats number into Indian Rupee (INR) representation
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formats large numbers compactly in Indian Lakhs and Crores
export const formatCompactCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const abs = Math.abs(amount);

  if (abs >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (abs >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatPercentage = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0%';
  return `${Number(num).toFixed(1)}%`;
};

export const getUtilizationStatus = (percentage) => {
  if (percentage >= 100) {
    return {
      level: 'exceeded',
      label: 'Exceeded',
      textColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
      barColor: 'bg-rose-500',
    };
  }
  if (percentage >= 90) {
    return {
      level: 'critical',
      label: 'Critical',
      textColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/40',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      barColor: 'bg-orange-500',
    };
  }
  if (percentage >= 80) {
    return {
      level: 'warning',
      label: 'Warning',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      barColor: 'bg-amber-500',
    };
  }
  return {
    level: 'healthy',
    label: 'Healthy',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    barColor: 'bg-emerald-500',
  };
};
