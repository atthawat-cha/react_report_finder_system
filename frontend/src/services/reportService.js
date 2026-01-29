import api from './api';

const reportService = {
  // Get all reports
  getReports: (params = {}) => {
    return api.get('/reports', { params });
  },

  // Get single report
  getReport: (id) => {
    return api.get(`/reports/${id}`);
  },

  // Upload report
  uploadReport: (formData, onUploadProgress) => {
    return api.post('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
  },

  // Update report
  updateReport: (id, data) => {
    return api.put(`/reports/${id}`, data);
  },

  // Delete report
  deleteReport: (id) => {
    return api.delete(`/reports/${id}`);
  },

  // Download report
  downloadReport: (id, filename) => {
    return api.get(`/reports/${id}/download`, {
      responseType: 'blob'
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  },

  // Search reports
  searchReports: (query, filters = {}) => {
    return api.get('/reports', {
      params: { search: query, ...filters }
    });
  }
};

export default reportService;