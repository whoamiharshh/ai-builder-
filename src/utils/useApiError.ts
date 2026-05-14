import { useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

export function useApiError() {
  const { addToast } = useToast();

  const handleError = useCallback((error: any) => {
    const message = error.userMessage || error.message || 'An error occurred';
    addToast(message, 'error', 5000);
    console.error('API Error:', error);
  }, [addToast]);

  return { handleError };
}

export function useApiSuccess() {
  const { addToast } = useToast();

  const showSuccess = useCallback((message: string = 'Operation successful') => {
    addToast(message, 'success', 3000);
  }, [addToast]);

  return { showSuccess };
}
