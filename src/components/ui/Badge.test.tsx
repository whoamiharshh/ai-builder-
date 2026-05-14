import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders with children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders with tag variant', () => {
    const { container } = render(<Badge variant="tag">Tag</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-white/10');
  });

  it('renders with status variant', () => {
    const { container: successContainer } = render(
      <Badge variant="status" status="success">
        Active
      </Badge>
    );
    expect(successContainer.firstChild).toHaveClass('bg-emerald-500/20');

    const { container: warningContainer } = render(
      <Badge variant="status" status="warning">
        Warning
      </Badge>
    );
    expect(warningContainer.firstChild).toHaveClass('bg-amber-500/20');

    const { container: errorContainer } = render(
      <Badge variant="status" status="error">
        Error
      </Badge>
    );
    expect(errorContainer.firstChild).toHaveClass('bg-red-500/20');

    const { container: infoContainer } = render(
      <Badge variant="status" status="info">
        Info
      </Badge>
    );
    expect(infoContainer.firstChild).toHaveClass('bg-cyan-500/20');
  });

  it('renders with score variant', () => {
    const { container } = render(<Badge variant="score">8.5/10</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-cyber/20');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom">Custom</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('custom');
  });

  it('applies base styling classes', () => {
    const { container } = render(<Badge>Test</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('rounded-full');
  });
});
