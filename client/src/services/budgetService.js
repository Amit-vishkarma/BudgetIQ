import api from './api';

export const budgetService = {
  getBudgets: async (params = {}) => {
    const res = await api.get('/budgets', { params });
    return res.data;
  },

  createBudget: async (budgetData) => {
    const res = await api.post('/budgets', budgetData);
    return res.data;
  },

  updateBudget: async (id, budgetData) => {
    const res = await api.put(`/budgets/${id}`, budgetData);
    return res.data;
  },

  deleteBudget: async (id) => {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  },

  getComparison: async (params = {}) => {
    const res = await api.get('/budgets/comparison', { params });
    return res.data;
  },
};
