import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Header } from '../Header';

// useLiveEventsフックをモックして、idolsデータを提供する
vi.mock('@/providers/LiveEventsProvider', () => ({
  useLiveEvents: () => ({
    idols: [
      {
        id: 'idol1',
        name: 'アイドルA',
        twitter_id: 'idol1_x',
        instagram_id: 'idol1_inst',
        litlink_id: 'idol1',
      },
      {
        id: 'idol2',
        name: 'アイドルB',
        twitter_id: 'idol2_x',
        tiktok_id: 'idol2_tiktok',
        litlink_id: 'idol2',
      },
    ],
    updatedAt: '2024-01-01T00:00:00.000Z',
    error: null,
  }),
}));

describe('Header', () => {
  it('renders header with title', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('開催予定のライブ')).toBeInTheDocument();
  });

  it('opens and closes the menu', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

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

  it('toggles between upcoming and past events', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    // 初期状態: 「過去分」ボタンが表示されている
    const pastButton = screen.getByRole('link', { name: '過去分' });
    expect(pastButton).toBeInTheDocument();

    // 「過去分」ボタンをクリックするとURLが/pastに変わり、「開催予定」ボタンに切り替わる
    fireEvent.click(pastButton);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: '開催予定' })).toBeInTheDocument();
    });

    // 「開催予定」ボタンをクリックするとURLが/に戻り、「過去分」ボタンに切り替わる
    const upcomingButton = screen.getByRole('link', { name: '開催予定' });
    fireEvent.click(upcomingButton);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: '過去分' })).toBeInTheDocument();
    });
  });

  it('hides the button on other paths', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Header />
      </MemoryRouter>
    );

    // ボタンが存在しないことを確認
    expect(screen.queryByRole('link', { name: '過去分' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '開催予定' })).not.toBeInTheDocument();
  });

  it('displays idol SNS items when menu is open', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menuButton);

    await waitFor(() => {
      // X.comのテキストが少なくとも1つ存在することを確認
      expect(screen.getAllByText('X.com').length).toBeGreaterThan(0);

      const findSNSLink = (name: string, href: string) =>
        screen
          .getAllByRole('link', { name: name })
          .find((link) => link.getAttribute('href') === href);

      // アイドルAのSNSリンクを確認
      expect(findSNSLink('lit.link', 'https://lit.link/idol1')).toBeInTheDocument();
      expect(findSNSLink('X.com', 'https://x.com/idol1_x')).toBeInTheDocument();
      expect(findSNSLink('TikTok', 'https://www.tiktok.com/@idol1_tiktok')).toBeUndefined();
      expect(findSNSLink('Instagram', 'https://www.instagram.com/idol1_inst/')).toBeInTheDocument();

      // アイドルBのSNSリンクを確認
      expect(findSNSLink('lit.link', 'https://lit.link/idol2')).toBeInTheDocument();
      expect(findSNSLink('X.com', 'https://x.com/idol2_x')).toBeInTheDocument();
      expect(findSNSLink('TikTok', 'https://www.tiktok.com/@idol2_tiktok')).toBeInTheDocument();
      expect(findSNSLink('Instagram', 'https://www.instagram.com/idol2_inst/')).toBeUndefined();
    });
  });

  it('displays idol lit.link items when menu is open', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menuButton);

    await waitFor(() => {
      // lit.linkのテキストが少なくとも1つ存在することを確認
      expect(screen.getAllByText('lit.link').length).toBeGreaterThan(0);
    });
  });
});
