import api from './api';

export const transactionService = {
  getTransactions: async (params = {}) => {
    const res = await api.get('/transactions', { params });
    return res.data;
  },

  getTransactionById: async (id) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
  },

  createTransaction: async (formData) => {
    // Check if formData is instance of FormData (e.g. file upload) or plain object
    const isFormData = formData instanceof FormData;
    const res = await api.post('/transactions', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },

  updateTransaction: async (id, formData) => {
    const isFormData = formData instanceof FormData;
    const res = await api.put(`/transactions/${id}`, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },

  deleteTransaction: async (id) => {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  },

  exportCSV: async (params = {}) => {
    const res = await api.get('/transactions/export/csv', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },
};
