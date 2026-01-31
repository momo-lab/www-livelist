import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MembersPageSkeleton } from '@/components/MembersPageSkeleton';
import { useLiveEvents } from '@/providers/LiveEventsProvider';
import type { Idol, Member } from '@/types';
import { MembersPage } from '../MembersPage';

vi.mock('@/components/MembersPageSkeleton');
vi.mock('@/providers/LiveEventsProvider');

const mockUseLiveEvents = vi.mocked(useLiveEvents);

const mockIdols: Idol[] = [
  {
    id: 'mofcro',
    name: 'もふくろちゃん',
    short_name: 'もふ',
    colors: { background: '#fff', foreground: '#000', text: '#000' },
  },
  {
    id: 'lumi7',
    name: 'LUMiNATiO',
    short_name: 'るみな',
    colors: { background: '#fff', foreground: '#000', text: '#000' },
  },
];

const mockMembers: Member[] = [
  {
    id: 'mofcrokoharu',
    idol_id: 'mofcro',
    name: '一野瀬 心晴',
    name_ruby: 'いちのせ こはる',
    color: 'yellow',
    color_code: '#000000',
    twitter_id: 'koharu',
  },
  {
    id: 'mofcroELLiE',
    idol_id: 'mofcro',
    name: '六星 エリィ',
    name_ruby: 'ろくほし えりぃ',
    color: 'purple',
    color_code: '#000000',
    twitter_id: 'ellie',
  },
  {
    id: 'lumi7rina',
    idol_id: 'lumi7',
    name: '高橋 りな',
    name_ruby: 'たかはし りな',
    color: 'blue',
    color_code: '#000000',
    twitter_id: 'rina',
    leaving_date: '2024-01-01',
  },
];

// Mock window.open
const mockWindowOpen = vi.fn();
beforeEach(() => {
  vi.stubGlobal('open', mockWindowOpen);
  vi.mocked(MembersPageSkeleton).mockReturnValue(<div>Loading...</div>);

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
    expect(screen.getByText('もふくろちゃん', { selector: 'h2' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: '一野瀬 いちのせ 心晴 こはる' })
    ).toBeInTheDocument();
  });

  it('shows search button when a member is selected', async () => {
    renderComponent();
    expect(screen.queryByRole('button', { name: /ツイートを検索/ })).not.toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', { name: '一野瀬 いちのせ 心晴 こはる' });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /1人のツイートを検索/ })).toBeInTheDocument();
    });
  });

  it('opens twitter search with correct query when search button is clicked', async () => {
    renderComponent();

    const checkbox1 = screen.getByRole('checkbox', { name: '一野瀬 いちのせ 心晴 こはる' });
    const checkbox2 = screen.getByRole('checkbox', { name: '六星 ろくほし エリィ' });
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
