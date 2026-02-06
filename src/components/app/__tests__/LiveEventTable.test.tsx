import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockTableEvents } from '@/__mocks__';
import { LiveEventTable } from '../LiveEventTable';

// Keep mock for ExternalLink as it's from a third-party icon library
vi.mock('lucide-react', () => ({
  ExternalLink: () => <svg data-testid="ExternalLink" />,
  CalendarPlus: () => <svg data-testid="CalendarPlus" />,
}));

// Mock formatDate utility (LiveEventTableのテストで日付の表示形式をコントロールするため)
vi.mock('@/lib/utils', async () => {
  const originalModule = await vi.importActual<typeof import('@/lib/utils')>('@/lib/utils');
  return {
    ...originalModule,
    formatDate: vi.fn((date: Date) => {
      const d = date.getDate();
      const m = date.getMonth() + 1;
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      return `${m}/${d}(${dayOfWeek})`;
    }),
  };
});

// 現在の日付を固定
vi.setSystemTime(new Date('2025-07-15T00:00:00Z')); // この日付に合わせて isToday が決定される

describe('LiveEventTable', () => {
  it('renders table headers', () => {
    render(<LiveEventTable tableData={[]} />);
    expect(screen.getByRole('columnheader', { name: '日付' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'イベント内容' })).toBeInTheDocument();
  });

  it('renders correct number of table rows', () => {
    render(<LiveEventTable tableData={mockTableEvents} />);
    const tableRows = screen.getAllByRole('row');
    // The first row is the header row, so we expect mockTableEvents.length + 1 rows
    expect(tableRows).toHaveLength(mockTableEvents.length + 1);
  });

  it('renders first event of the day correctly with rowspan and date', () => {
    render(<LiveEventTable tableData={[mockTableEvents[0]]} />);
    // Get all rows, skip the header row
    const dateCell = screen.getByText('7/15(火)');
    expect(dateCell).toBeInTheDocument();
    // Check the actual td element for rowspan
    expect(dateCell.closest('td')).toHaveAttribute('rowspan', '2');

    expect(screen.getByText(mockTableEvents[0].content)).toBeInTheDocument();
    expect(screen.getByText(mockTableEvents[0].idol.short_name)).toBeInTheDocument();
    // Use getAllByRole('link') and pick the first one
    const detailLinks = screen.getAllByRole('link', { name: '詳細' });
    expect(detailLinks[0]).toHaveAttribute('href', mockTableEvents[0].link);
    expect(detailLinks[0].querySelector('[data-testid="ExternalLink"]')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockTableEvents[0].image);
  });

  it('renders subsequent event of the same day correctly without date cell', () => {
    // mockTableEvents[1].link と image を空文字列にするために一時的にコピーを修正
    const tempMockTableEvents = [...mockTableEvents];
    tempMockTableEvents[1] = { ...tempMockTableEvents[1], link: undefined, image: undefined };

    render(<LiveEventTable tableData={tempMockTableEvents} />);
    const secondEventRow = screen.getAllByRole('row')[2]; // Index 2 for the second data row
    // Ensure no date cell for the second event by checking for a td with rowspan
    expect(secondEventRow.querySelector('td[rowspan]')).toBeNull();

    // Ensure no link button or image for this event
    expect(secondEventRow.querySelector('a')).toBeNull(); // Check for <a> tag for LinkButton
    expect(secondEventRow.querySelector('img')).toBeNull();
  });

  it('renders event on a new day correctly with date cell', () => {
    render(<LiveEventTable tableData={mockTableEvents} />);
    const thirdEventRow = screen.getAllByRole('row')[3]; // Index 3 for the third data row
    const dateCell = screen.getByText('7/16(水)'); // formatDateのモックに合わせて期待値を変更
    expect(dateCell).toBeInTheDocument();
    expect(dateCell.closest('td')).toHaveAttribute('rowspan', '1');

    expect(screen.getByText(mockTableEvents[2].content)).toBeInTheDocument();
    // Idol A が複数検出されるため、getAllByText で取得し適切な要素を選択
    const shortNameElement = screen
      .getAllByText(mockTableEvents[2].idol.short_name)
      .find((el) => el.closest('tr') === thirdEventRow);
    expect(shortNameElement).toBeInTheDocument();
    const detailLinks = screen.getAllByRole('link', { name: '詳細' });
    expect(detailLinks[2]).toHaveAttribute('href', mockTableEvents[2].link); // インデックス修正
    expect(detailLinks[2].querySelector('[data-testid="ExternalLink"]')).toBeInTheDocument();
    expect(thirdEventRow.querySelector('img')).toBeNull(); // No image for this event
  });

  it('displays "本日" badge for events on today\'s date', () => {
    render(<LiveEventTable tableData={mockTableEvents} />);
    const todayBadges = screen.getAllByText('本日');
    expect(todayBadges.length).toBe(1);
    expect(todayBadges[0]).toBeInTheDocument();
  });

  it('does not display "本日" badge for events not on today\'s date', () => {
    // Create test data with only non-today events
    const nonTodayData = mockTableEvents.filter((event) => !event.isToday);

    render(<LiveEventTable tableData={nonTodayData} />);
    expect(screen.queryByText('本日')).not.toBeInTheDocument();
  });
});
