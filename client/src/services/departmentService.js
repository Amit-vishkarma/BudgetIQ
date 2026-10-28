import api from './api';

export const departmentService = {
  getDepartments: async () => {
    const res = await api.get('/departments');
    return res.data;
  },

  createDepartment: async (deptData) => {
    const res = await api.post('/departments', deptData);
    return res.data;
  },

  updateDepartment: async (id, deptData) => {
    const res = await api.put(`/departments/${id}`, deptData);
    return res.data;
  },

  deleteDepartment: async (id) => {
    const res = await api.delete(`/departments/${id}`);
    return res.data;
  },
};
