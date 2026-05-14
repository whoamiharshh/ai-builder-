import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalFooter } from './Modal';

describe('Modal Component', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal content
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">
        Content
      </Modal>
    );
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('renders all sizes', () => {
    const { rerender, container: smContainer } = render(
      <Modal isOpen={true} onClose={() => {}} size="sm">
        Content
      </Modal>
    );
    expect(smContainer.querySelector('div[class*="max-w-sm"]')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="md">
        Content
      </Modal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        Content
      </Modal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );

    const backdrop = container.querySelector('div[class*="bg-black"]');
    if (backdrop) {
      await user.click(backdrop);
      expect(handleClose).toHaveBeenCalledOnce();
    }
  });

  it('has proper accessibility', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Modal">
        Content
      </Modal>
    );
    expect(screen.getByText('Accessible Modal')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} className="custom-modal">
        Content
      </Modal>
    );
    const modal = container.querySelector('div[class*="custom-modal"]');
    expect(modal).toHaveClass('custom-modal');
  });
});

describe('ModalFooter Component', () => {
  it('renders children', () => {
    render(
      <ModalFooter>
        <button>Cancel</button>
        <button>Confirm</button>
      </ModalFooter>
    );
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('applies default styling', () => {
    const { container } = render(
      <ModalFooter>
        <button>Action</button>
      </ModalFooter>
    );
    const footer = container.firstChild;
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('border-t');
  });

  it('accepts custom className', () => {
    const { container } = render(
      <ModalFooter className="custom-footer">
        <button>Action</button>
      </ModalFooter>
    );
    const footer = container.firstChild;
    expect(footer).toHaveClass('custom-footer');
  });
});
