import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../contexts/ToastContext';
import React from 'react';

describe('ToastContext', () => {
  it('adds toast successfully', () => {
    const wrapper = (props: any) => React.createElement(ToastProvider, props);
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('Test message', 'success');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].type).toBe('success');
  });

  it('removes toast successfully', () => {
    const wrapper = (props: any) => React.createElement(ToastProvider, props);
    const { result } = renderHook(() => useToast(), { wrapper });

    let toastId: string;
    act(() => {
      result.current.addToast('Test message', 'error');
      toastId = result.current.toasts[0].id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.removeToast(toastId!);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('removes toast after duration', () => {
    vi.useFakeTimers();
    const wrapper = (props: any) => React.createElement(ToastProvider, props);
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('Temporary message', 'info', 1000);
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.toasts).toHaveLength(0);
    vi.useRealTimers();
  });

  it('throws error when useToast used outside provider', () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within ToastProvider');
  });
});

import { vi } from 'vitest';
