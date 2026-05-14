import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar Component', () => {
  it('renders progress bar', () => {
    const { container } = render(<ProgressBar value={50} />);
    const progressFill = container.querySelector('div[class*="bg-cyber"]');
    expect(progressFill).toBeInTheDocument();
  });

  it('sets correct width based on value', () => {
    const { container } = render(<ProgressBar value={75} />);
    const progressFill = container.querySelector('div[class*="bg-cyber"]');
    expect(progressFill).toHaveStyle('width: 75%');
  });

  it('caps value at 100%', () => {
    const { container } = render(<ProgressBar value={150} />);
    const progressFill = container.querySelector('div[class*="bg-cyber"]');
    expect(progressFill).toHaveStyle('width: 100%');
  });

  it('handles zero value', () => {
    const { container } = render(<ProgressBar value={0} />);
    const progressFill = container.querySelector('div[class*="bg-cyber"]');
    expect(progressFill).toHaveStyle('width: 0%');
  });

  it('renders with label', () => {
    render(<ProgressBar value={50} label="Progress" />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    const { container } = render(<ProgressBar value={50} />);
    const labels = container.querySelectorAll('div[class*="text-sm"]');
    expect(labels).toHaveLength(0);
  });

  it('applies proper styling', () => {
    const { container } = render(<ProgressBar value={50} />);
    const progressContainer = container.querySelector('div[class*="bg-slate-900"]');
    expect(progressContainer).toHaveClass('rounded-full');
  });

  it('handles negative values', () => {
    const { container } = render(<ProgressBar value={-10} />);
    const progressFill = container.querySelector('div[class*="bg-cyber"]');
    expect(progressFill).toHaveStyle('width: 0%');
  });
});
