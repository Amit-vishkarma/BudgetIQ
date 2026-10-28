import api from './api';

export const dashboardService = {
  getSummary: async (params = {}) => {
    const res = await api.get('/dashboard/summary', { params });
    return res.data;
  },

  getExpenseTrends: async (params = {}) => {
    const res = await api.get('/dashboard/expense-trends', { params });
    return res.data;
  },

  getCategoryBreakdown: async (params = {}) => {
    const res = await api.get('/dashboard/category-breakdown', { params });
    return res.data;
  },
};
