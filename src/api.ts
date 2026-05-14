import axios from 'axios';
import type { SyntheticResponse } from './types';
import { supabase } from './lib/supabase';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000',
});

// Max retries for failed requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Error handler with user-friendly messages
const getErrorMessage = (error: any): string => {
  if (error.response?.status === 401) {
    return 'Session expired. Please log in again.';
  }
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  if (error.response?.status >= 500) {
    return 'Server error. Our team is working to fix it.';
  }
  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }
  return error.response?.data?.message || 'An unexpected error occurred. Please try again.';
};

// Request interceptor: add auth token + retry logic
let retryCount = 0;
apiClient.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    retryCount = 0; // Reset retry count for new requests
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors and implement retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry logic for specific error codes
    const isRetryable = [408, 429, 500, 502, 503, 504].includes(error.response?.status);
    
    if (isRetryable && retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
      return apiClient(config);
    }

    // Handle 401 - token expired, redirect to login
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }

    // Attach user-friendly message to error
    error.userMessage = getErrorMessage(error);

    return Promise.reject(error);
  }
);

// =====================
// USER ENDPOINTS
// =====================

export async function getUserProfile() {
  const response = await apiClient.get('/api/user/profile');
  return response.data;
}

export async function updateUserProfile(data: { display_name?: string; avatar_url?: string }) {
  const response = await apiClient.put('/api/user/profile', data);
  return response.data;
}

// =====================
// PROJECT ENDPOINTS
// =====================

export async function getProjects() {
  const response = await apiClient.get('/api/projects');
  return response.data;
}

export async function createProject(data: { name: string; description?: string; niche?: string }) {
  const response = await apiClient.post('/api/projects', data);
  return response.data;
}

export async function getProject(id: string) {
  const response = await apiClient.get(`/api/projects/${id}`);
  return response.data;
}

export async function updateProject(id: string, data: any) {
  const response = await apiClient.put(`/api/projects/${id}`, data);
  return response.data;
}

export async function deleteProject(id: string) {
  const response = await apiClient.delete(`/api/projects/${id}`);
  return response.data;
}

// =====================
// GENERATION ENDPOINTS
// =====================

export async function generateProduct(prompt: string, projectId?: string): Promise<SyntheticResponse> {
  const response = await apiClient.post('/api/generate', { prompt, projectId });
  return response.data as SyntheticResponse;
}

export async function generateImage(prompt: string): Promise<{ images: string[] }> {
  const response = await apiClient.post('/api/generate-image', { prompt });
  return response.data as { images: string[] };
}

export async function getGenerations(projectId: string) {
  const response = await apiClient.get(`/api/generations/${projectId}`);
  return response.data;
}

// =====================
// EXPORT ENDPOINTS
// =====================

export async function getExportFormats() {
  const response = await apiClient.get('/api/export/formats');
  return response.data.formats;
}

export async function exportGeneration(format: string, title: string, content: any, metadata?: any) {
  const response = await apiClient.post('/api/export', { format, title, content, metadata }, {
    responseType: 'blob',
  });
  return response.data;
}

export async function getExports() {
  const response = await apiClient.get('/api/exports');
  return response.data;
}

// =====================
// HEALTH ENDPOINTS
// =====================

export async function checkHealth(): Promise<{ status: string }> {
  const response = await apiClient.get('/api/health');
  return response.data;
}

export default apiClient;
