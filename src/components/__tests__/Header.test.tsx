import { LiveEventsProvider } from '@/providers/LiveEventsProvider';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Header } from '../Header';

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
    const menuButton = screen.getByRole('button', { name: 'Toggle menu' });
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

  it('displays lit.link items when menu is open', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LiveEventsProvider>
          <Header />
        </LiveEventsProvider>
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: 'Toggle menu' });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText('lit.link')).toBeInTheDocument();
      expect(screen.getByText('旧サイト(削除予定)')).toBeInTheDocument();
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
});
