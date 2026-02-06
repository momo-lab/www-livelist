import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { mockIdols, mockVersions } from '@/__mocks__';
import { HeaderSlotsProvider } from '@/providers/HeaderSlotsProvider'; // HeaderSlotsProvider をインポート
import { Header } from '../Header';

// useLiveEventsフックをモックして、idolsデータを提供する
vi.mock('@/providers/LiveEventsProvider', () => ({
  useLiveEvents: () => ({
    idols: mockIdols,
    updatedAt: mockVersions.updatedAt,
    error: null,
  }),
}));

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <HeaderSlotsProvider>
          <Header />
        </HeaderSlotsProvider>
      </MemoryRouter>
    );
  };

  it('renders header with title', () => {
    renderHeader();
    expect(screen.getByText('開催予定のライブ')).toBeInTheDocument();
  });

  it('opens and closes the menu', async () => {
    renderHeader();

    // メニューが開くことを確認
    const menuButton = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menuButton);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /ルミナス所属アイドル/i })).toBeInTheDocument();
    });

    // メニューが閉じることを確認
    const upcomingLink = screen.getByRole('link', { name: '開催予定のライブ' });
    fireEvent.click(upcomingLink);
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /ルミナス所属アイドル/i })
      ).not.toBeInTheDocument();
    });
  });

  it('displays idol SNS items when menu is open', async () => {
    renderHeader();

    const menuButton = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menuButton);

    await waitFor(() => {
      // X.comのテキストが少なくとも1つ存在することを確認
      expect(screen.getAllByText('X.com').length).toBeGreaterThan(0);

      const findSNSLink = (name: string, href: string) =>
        screen
          .getAllByRole('link', { name: name })
          .find((link) => link.getAttribute('href') === href);

      // アイドルA (mockIdols[0] = mofcro) のSNSリンクを確認
      expect(
        findSNSLink('lit.link', `https://lit.link/${mockIdols[0].litlink_id}`)
      ).toBeInTheDocument();
      expect(findSNSLink('X.com', `https://x.com/${mockIdols[0].twitter_id}`)).toBeInTheDocument();
      expect(
        findSNSLink('TikTok', `https://www.tiktok.com/@${mockIdols[0].tiktok_id}`)
      ).toBeUndefined(); // mofcroにはtiktok_idがない
      expect(
        findSNSLink('Instagram', `https://www.instagram.com/${mockIdols[0].instagram_id}/`)
      ).toBeInTheDocument();

      // アイドルB (mockIdols[1] = lumi7) のSNSリンクを確認
      expect(
        findSNSLink('lit.link', `https://lit.link/${mockIdols[1].litlink_id}`)
      ).toBeInTheDocument();
      expect(findSNSLink('X.com', `https://x.com/${mockIdols[1].twitter_id}`)).toBeInTheDocument();
      expect(
        findSNSLink('TikTok', `https://www.tiktok.com/@${mockIdols[1].tiktok_id}`)
      ).toBeInTheDocument();
      expect(
        findSNSLink('Instagram', `https://www.instagram.com/${mockIdols[1].instagram_id}/`)
      ).toBeUndefined(); // lumi7にはinstagram_idがない
    });
  });

  it('displays idol lit.link items when menu is open', async () => {
    renderHeader();

    const menuButton = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menuButton);

    await waitFor(() => {
      // lit.linkのテキストが少なくとも1つ存在することを確認
      expect(screen.getAllByText('lit.link').length).toBeGreaterThan(0);
    });
  });
});
