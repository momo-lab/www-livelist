import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MembersPageSkeleton } from '@/components/MembersPageSkeleton';
import * as useLiveEvents from '@/hooks/useLiveEvents';
import type { Idol, Member } from '@/types';
import { MembersPage } from '../MembersPage';

vi.mock('@/components/MembersPageSkeleton');

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
    idol_id: 'mofcro',
    name: '一野瀬 心晴',
    name_ruby: 'いちのせ こはる',
    color: 'yellow',
    twitter_id: 'koharu',
  },
  {
    idol_id: 'mofcro',
    name: '六星 エリィ',
    name_ruby: 'ろくほし えりぃ',
    color: 'purple',
    twitter_id: 'ellie',
  },
  {
    idol_id: 'lumi7',
    name: '高橋 りな',
    name_ruby: 'たかはし りな',
    color: 'blue',
    twitter_id: 'rina',
    leaving_date: '2024-01-01',
  },
];

const mockUseLiveEvents = vi.spyOn(useLiveEvents, 'useLiveEvents');

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
    expect(screen.getByText('一野瀬 心晴')).toBeInTheDocument();
    expect(screen.getByText('高橋 りな')).toBeInTheDocument();
  });

  it('shows search button when a member is selected', async () => {
    renderComponent();
    expect(screen.queryByRole('button', { name: /ツイートを検索/ })).not.toBeInTheDocument();

    const checkbox = screen.getByLabelText('一野瀬 心晴');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /1人のツイートを検索/ })).toBeInTheDocument();
    });
  });

  it('opens twitter search with correct query when search button is clicked', async () => {
    renderComponent();

    const checkbox1 = screen.getByLabelText('一野瀬 心晴');
    const checkbox2 = screen.getByLabelText('六星 エリィ');
    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    const searchButton = await screen.findByRole('button', { name: /2人のツイートを検索/ });
    fireEvent.click(searchButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('from%3Akoharu'),
      '_blank',
      'noopener,noreferrer'
    );
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('from%3Aellie'),
      '_blank',
      'noopener,noreferrer'
    );
  });
});
