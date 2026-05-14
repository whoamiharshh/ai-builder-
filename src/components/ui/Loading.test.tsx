import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, SkeletonLoader } from './Loading';

describe('LoadingSpinner Component', () => {
  it('renders spinner', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('div[class*="rounded-full"]')).toBeInTheDocument();
  });

  it('renders all sizes', () => {
    const { container: smContainer } = render(<LoadingSpinner size="sm" />);
    expect(smContainer.querySelector('div[class*="w-4"]')).toBeInTheDocument();

    const { container: mdContainer } = render(<LoadingSpinner size="md" />);
    expect(mdContainer.querySelector('div[class*="w-8"]')).toBeInTheDocument();

    const { container: lgContainer } = render(<LoadingSpinner size="lg" />);
    expect(lgContainer.querySelector('div[class*="w-12"]')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<LoadingSpinner label="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders without label', () => {
    const { container } = render(<LoadingSpinner />);
    const label = container.querySelector('p');
    expect(label).not.toBeInTheDocument();
  });
});

describe('SkeletonLoader Component', () => {
  it('renders default skeleton', () => {
    const { container } = render(<SkeletonLoader />);
    const skeleton = container.querySelector('div[class*="rounded-lg"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders multiple skeletons', () => {
    const { container } = render(<SkeletonLoader count={3} />);
    const skeletons = container.querySelectorAll('div[class*="rounded-lg"]');
    expect(skeletons).toHaveLength(3);
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonLoader className="h-6 w-32" />);
    const skeleton = container.querySelector('div[class*="h-6"]');
    expect(skeleton).toHaveClass('h-6');
    expect(skeleton).toHaveClass('w-32');
  });

  it('has proper animation', () => {
    const { container } = render(<SkeletonLoader />);
    const skeleton = container.querySelector('div[class*="rounded-lg"]');
    expect(skeleton).toHaveClass('bg-slate-800');
  });
});
