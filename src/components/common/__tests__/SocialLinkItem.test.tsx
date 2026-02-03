import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SocialLinkItem } from '../SocialLinkItem';

// Mock icon component
const MockIcon = vi.fn((props) => <svg {...props} data-testid="mock-icon" />);

describe('SocialLinkItem', () => {
  it('renders correctly with all props', () => {
    const handleClick = vi.fn();
    render(
      <MemoryRouter>
        <SocialLinkItem
          to="https://example.com/link"
          icon={MockIcon}
          siteName="Test Site"
          onClick={handleClick}
        />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link', { name: 'Test Site' });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com/link');
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    expect(linkElement).toHaveAttribute('aria-label', 'Test Site');

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Site')).toBeInTheDocument();
  });

  it('does not render when to prop is empty', () => {
    const handleClick = vi.fn();
    render(
      <MemoryRouter>
        <SocialLinkItem icon={MockIcon} siteName="Test Site" onClick={handleClick} />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: 'Test Site' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Site')).not.toBeInTheDocument();
  });

  it('calls onClick when the link is clicked', () => {
    const handleClick = vi.fn();
    render(
      <MemoryRouter>
        <SocialLinkItem
          to="https://example.com/link"
          icon={MockIcon}
          siteName="Test Site"
          onClick={handleClick}
        />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link', { name: 'Test Site' });
    fireEvent.click(linkElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
