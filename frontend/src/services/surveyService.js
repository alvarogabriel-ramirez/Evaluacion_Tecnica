import api from './api';

export const surveyService = {
  // Countries
  getCountries: async () => {
    const response = await api.get('/countries');
    return response.data;
  },

  // Companies
  getCompaniesByCountry: async (countryId) => {
    const response = await api.get(`/companies?country_id=${countryId}`);
    return response.data;
  },

  // Locations
  getLocationsByCompany: async (companyId) => {
    const response = await api.get(`/locations?company_id=${companyId}`);
    return response.data;
  },

  // Surveys
  getSurveys: async () => {
    const response = await api.get('/surveys');
    return response.data;
  },

  getSurveyById: async (surveyId) => {
    const response = await api.get(`/surveys/${surveyId}`);
    return response.data;
  },

  // Submit response
  submitSurveyResponse: async (data) => {
    const response = await api.post('/responses', data);
    return response.data;
  },

  // Get responses
  getSurveyResponses: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/responses?${params}`);
    return response.data;
  },

  // Export responses
  exportResponses: async (surveyId) => {
    const response = await api.get(`/responses/export/csv?survey_id=${surveyId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
