import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form initially', () => {
    renderComponent();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('validates email on blur', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByLabelText(/Email/i);
    await user.click(emailInput);
    await user.type(emailInput, 'invalid');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('validates password length on signup', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Switch to signup
    const toggleButton = screen.getByText(/Don't have an account/i);
    await user.click(toggleButton);

    const passwordInput = screen.getByLabelText(/Password/i);
    await user.click(passwordInput);
    await user.type(passwordInput, 'short');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('toggles between login and signup modes', async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByText('Sign in')).toBeInTheDocument();

    const toggleButton = screen.getByText(/Don't have an account/i);
    await user.click(toggleButton);

    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /Sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it('clears errors when input changes', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByLabelText(/Email/i);
    await user.click(emailInput);
    await user.type(emailInput, 'invalid');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });

    await user.clear(emailInput);
    await user.type(emailInput, 'valid@email.com');

    // Error should disappear
    expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument();
  });
});
