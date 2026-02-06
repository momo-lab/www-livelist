import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockIdols, mockMembers } from '@/__mocks__';
import { useLiveEvents } from '@/providers/LiveEventsProvider';
import { MembersPage } from '../MembersPage';

vi.mock('@/components/app/MembersPageSkeleton', () => ({
  MembersPageSkeleton: () => <div>Mocked MembersPageSkeleton</div>,
}));
vi.mock('@/providers/LiveEventsProvider');

const mockUseLiveEvents = vi.mocked(useLiveEvents);

// Mock window.open
const mockWindowOpen = vi.fn();
beforeEach(() => {
  vi.stubGlobal('open', mockWindowOpen);

  mockUseLiveEvents.mockReturnValue({
    idols: mockIdols,
    members: mockMembers,
    allEvents: [],
    loading: false,
    updatedAt: new Date(),
    error: null,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const renderComponent = () =>
  render(
    <BrowserRouter>
      <MembersPage />
    </BrowserRouter>
  );

describe('MembersPage', () => {
  it('renders members grouped by idol', () => {
    renderComponent();
    expect(screen.getByText(mockIdols[3].name, { selector: 'h2' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: new RegExp(`^${mockMembers[0].name.split(' ')[0]}`),
      })
    ).toBeInTheDocument();
  });

  it('shows search button when a member is selected', async () => {
    renderComponent();
    expect(screen.queryByRole('button', { name: /ツイートを検索/ })).not.toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', {
      name: new RegExp(`^${mockMembers[0].name.split(' ')[0]}`),
    });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /1人のツイートを検索/ })).toBeInTheDocument();
    });
  });

  it('opens twitter search with correct query when search button is clicked', async () => {
    renderComponent();

    const checkbox1 = screen.getByRole('checkbox', {
      name: new RegExp(`^${mockMembers[0].name.split(' ')[0]}`),
    });
    const checkbox2 = screen.getByRole('checkbox', {
      name: new RegExp(`^${mockMembers[1].name.split(' ')[0]}`),
    });
    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    const searchButton = await screen.findByRole('button', { name: /2人のツイートを検索/ });
    fireEvent.click(searchButton);

    const expectedQuery = `from:${mockMembers[0].twitter_id} OR from:${mockMembers[1].twitter_id}`;
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(`https://x.com/search?q=${encodeURIComponent(expectedQuery)}&f=live`),
      '_blank',
      'noopener,noreferrer'
    );
  });
});
