import { LiveEventsProvider } from '@/providers/LiveEventsProvider';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Header } from '../Header';

// LiveEventsProviderをモックして、テスト用のidolsデータを提供する
vi.mock('@/providers/LiveEventsProvider', () => ({
  LiveEventsProvider: ({ children }: { children: React.ReactNode }) => {
    return (
      <div data-testid="mock-live-events-provider">
        {/* Contextの値をモックする代わりに、childrenを直接レンダリング */}
        {children}
      </div>
    );
  },
}));

// useLiveEventsフックをモックして、idolsデータを提供する
vi.mock('@/hooks/useLiveEvents', () => ({
  useLiveEvents: () => ({
    idols: [
      { id: 'idol1', name: 'アイドルA', twitter_id: 'idol1_x' },
      { id: 'idol2', name: 'アイドルB', twitter_id: 'idol2_x' },
    ],
    error: null,
  }),
}));

describe('Header', () => {
  it('renders header with title', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LiveEventsProvider>
          <Header />
        </LiveEventsProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('開催予定のライブ')).toBeInTheDocument();
  });

  it('opens and closes the menu', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LiveEventsProvider>
          <Header />
        </LiveEventsProvider>
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
        <LiveEventsProvider>
          <Header />
        </LiveEventsProvider>
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
        <LiveEventsProvider>
          <Header />
        </LiveEventsProvider>
      </MemoryRouter>
    );

    // ボタンが存在しないことを確認
    expect(screen.queryByRole('link', { name: '過去分' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '開催予定' })).not.toBeInTheDocument();
  });

  it('displays idol x.com items when menu is open', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LiveEventsProvider>
          <Header />
        </LiveEventsProvider>
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText('X.com')).toBeInTheDocument();

      // アイドルAのX.comリンクを確認
      const idolAXcomLinks = screen.getAllByRole('link', { name: 'アイドルA' });
      const idolAXcomLink = idolAXcomLinks.find(
        (link) => link.getAttribute('href') === 'https://x.com/idol1_x'
      );
      expect(idolAXcomLink).toBeInTheDocument();
      expect(idolAXcomLink).toHaveAttribute('href', 'https://x.com/idol1_x');

      // アイドルBのX.comリンクを確認
      const idolBXcomLinks = screen.getAllByRole('link', { name: 'アイドルB' });
      const idolBXcomLink = idolBXcomLinks.find(
        (link) => link.getAttribute('href') === 'https://x.com/idol2_x'
      );
      expect(idolBXcomLink).toBeInTheDocument();
      expect(idolBXcomLink).toHaveAttribute('href', 'https://x.com/idol2_x');
    });
  });

  it('displays idol lit.link items when menu is open', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LiveEventsProvider>
          <Header />
        </LiveEventsProvider>
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText('lit.link')).toBeInTheDocument();

      // アイドルAのlit.linkを確認
      const idolALitLinkLinks = screen.getAllByRole('link', { name: 'アイドルA' });
      const idolALitLink = idolALitLinkLinks.find(
        (link) => link.getAttribute('href') === 'https://lit.link/idol1'
      );
      expect(idolALitLink).toBeInTheDocument();
      expect(idolALitLink).toHaveAttribute('href', 'https://lit.link/idol1');

      // アイドルBのlit.linkを確認
      const idolBLitLinkLinks = screen.getAllByRole('link', { name: 'アイドルB' });
      const idolBLitLink = idolBLitLinkLinks.find(
        (link) => link.getAttribute('href') === 'https://lit.link/idol2'
      );
      expect(idolBLitLink).toBeInTheDocument();
      expect(idolBLitLink).toHaveAttribute('href', 'https://lit.link/idol2');
    });
  });
});
