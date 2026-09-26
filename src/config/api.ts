// API Configuration for CarbonMatch AI Backend
// Update this URL to point to your Python backend

export const API_CONFIG = {
  // Replace with your deployed Python backend URL
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  endpoints: {
    health: '/health',
    upload: '/api/upload',
    map: '/api/map',
    calculate: '/api/calculate',
    epaFactors: '/api/epa-factors',
  },
  
  // Request timeout in milliseconds
  timeout: 30000,
};

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.endpoints): string => {
  return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
};
