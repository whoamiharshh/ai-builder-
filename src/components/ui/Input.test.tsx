import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input, TextArea } from './Input';

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('accepts input value', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');
    
    await user.type(input, 'test value');
    expect(input).toHaveValue('test value');
  });

  it('applies default styling', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('rounded-3xl');
    expect(input).toHaveClass('border');
  });

  it('accepts custom className', () => {
    const { container } = render(<Input className="custom" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('custom');
  });

  it('supports all input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByPlaceholderText('')).toHaveAttribute('type', 'password');
  });
});

describe('TextArea Component', () => {
  it('renders textarea element', () => {
    render(<TextArea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<TextArea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('accepts input value', async () => {
    const user = userEvent.setup();
    render(<TextArea placeholder="Type here" />);
    const textarea = screen.getByPlaceholderText('Type here');
    
    await user.type(textarea, 'multiline\ntext');
    expect(textarea).toHaveValue('multiline\ntext');
  });

  it('has minimum height', () => {
    const { container } = render(<TextArea />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('min-h-[160px]');
  });
});
