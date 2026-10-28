import api from './api';

export const optimizationService = {
  getRecommendations: async (params = {}) => {
    const res = await api.get('/optimization/recommendations', { params });
    return res.data;
  },

  generateRecommendations: async (period = null) => {
    const res = await api.post('/optimization/generate', { period });
    return res.data;
  },

  updateStatus: async (id, status, applyToBudget = false) => {
    const res = await api.patch(`/optimization/recommendations/${id}`, { status, applyToBudget });
    return res.data;
  },
};
