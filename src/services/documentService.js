import api from '@/lib/axios';

export const documentService = {

  getAll: async () => {
    const { data } = await api.get('/documents');
    return data;
  },

  getByCode: async (code) => {
    const inputData = {
      code: code,
    }
    const { data } = await api.post('/CodeToImage', inputData);
    console.log(data)
    return data;
  },

  create: async (docData) => {
    const { data } = await api.post('/documents', docData);
    return data;
  },

  update: async (id, docData) => {
    const { data } = await api.put(`/documents/${id}`, docData);
    return data;
  },

  delete: async (id) => {
    await api.delete(`/documents/${id}`);
  },
};
