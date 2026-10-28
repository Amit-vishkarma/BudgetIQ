import api from './api';

export const reportService = {
  getSummary: async (params = {}) => {
    const res = await api.get('/reports/summary', { params });
    return res.data;
  },

  getExpenses: async (params = {}) => {
    const res = await api.get('/reports/expenses', { params });
    return res.data;
  },
};
