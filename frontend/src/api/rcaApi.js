import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const rcaApi = {
  // AI Endpoints
  extractFromText: async (incidentText, sourceType = 'text', documentName = 'Direct Input') => {
    const response = await api.post('/ai/extract-rca', {
      incident_text: incidentText,
      source_type: sourceType,
      document_name: documentName,
    });
    return response.data;
  },

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_type', file.name.endsWith('.pdf') ? 'pdf' : 'file');
    
    const response = await api.post('/ai/upload-doc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSamples: async () => {
    const response = await api.get('/ai/samples');
    return response.data;
  },

  // Investigations CRUD
  getAllInvestigations: async (status = '', search = '') => {
    const params = {};
    if (status && status !== 'All') params.status = status;
    if (search) params.search = search;
    const response = await api.get('/investigations', { params });
    return response.data;
  },

  getInvestigationById: async (id) => {
    const response = await api.get(`/investigations/${id}`);
    return response.data;
  },

  saveInvestigation: async (data) => {
    if (data.id) {
      // update
      const response = await api.put(`/investigations/${data.id}`, data);
      return response.data;
    } else {
      // create
      const response = await api.post('/investigations', data);
      return response.data;
    }
  },

  deleteInvestigation: async (id) => {
    const response = await api.delete(`/investigations/${id}`);
    return response.data;
  },
};
