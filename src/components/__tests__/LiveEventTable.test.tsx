import type { TableEvent } from '@/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LiveEventTable } from '../LiveEventTable';

// Keep mock for ExternalLink as it's from a third-party icon library
vi.mock('lucide-react', () => ({
  ExternalLink: () => <svg data-testid="ExternalLink" />,
  CalendarPlus: () => <svg data-testid="CalendarPlus" />,
}));

const mockTableData: TableEvent[] = [
  {
    date: '2025-07-15',
    content: 'Event 1 Content',
    id: 'idol1',
    short_name: 'Idol A',
    link: 'http://example.com/link1',
    image: 'http://example.com/image1.png',
    rowspan: 2,
    isFirstOfDay: true,
    groupIndex: 0,
    colors: { background: '#FF0000', foreground: '#FFFFFF', text: '#000000' },
    isToday: true,
  },
  {
    date: '2025-07-15',
    content: 'Event 2 Content',
    id: 'idol2',
    short_name: 'Idol B',
    link: '', // No link
    image: '', // No image
    rowspan: undefined,
    isFirstOfDay: false,
    groupIndex: 0,
    colors: { background: '#00FF00', foreground: '#000000', text: '#000000' },
    isToday: true,
  },
  {
    date: '2025-07-16',
    content: 'Event 3 Content',
    id: 'idol3',
    short_name: 'Idol C',
    link: 'http://example.com/link3',
    image: '', // No image
    rowspan: 1,
    isFirstOfDay: true,
    groupIndex: 1,
    colors: { background: '#0000FF', foreground: '#FFFFFF', text: '#000000' },
    isToday: false,
  },
];

describe('LiveEventTable', () => {
  it('renders table headers', () => {
    render(<LiveEventTable tableData={[]} />);
    expect(screen.getByRole('columnheader', { name: '日付' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'イベント内容' })).toBeInTheDocument();
  });

  it('renders correct number of table rows', () => {
    render(<LiveEventTable tableData={mockTableData} />);
    const tableRows = screen.getAllByRole('row');
    // The first row is the header row, so we expect mockTableData.length + 1 rows
    expect(tableRows).toHaveLength(mockTableData.length + 1);
  });

  it('renders first event of the day correctly with rowspan and date', () => {
    render(<LiveEventTable tableData={mockTableData} />);
    // Get all rows, skip the header row
    const dateCell = screen.getByText('7/15(火)');
    expect(dateCell).toBeInTheDocument();
    // Check the actual td element for rowspan
    expect(dateCell.closest('td')).toHaveAttribute('rowspan', '2');

    expect(screen.getByText('Event 1 Content')).toBeInTheDocument();
    expect(screen.getByText('Idol A')).toBeInTheDocument();
    // Use getAllByRole('link') and pick the first one
    const detailLinks = screen.getAllByRole('link', { name: '詳細' });
    expect(detailLinks[0]).toHaveAttribute('href', 'http://example.com/link1');
    expect(detailLinks[0].querySelector('[data-testid="ExternalLink"]')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/image1.png');
    // For Badge, check the span element
    const badge = screen.getByText('Idol A').closest('span');
    expect(badge).toHaveStyle('background-color: #FF0000');
    expect(badge).toHaveStyle('color: #FFFFFF');
  });

  it('renders subsequent event of the same day correctly without date cell', () => {
    render(<LiveEventTable tableData={mockTableData} />);
    const secondEventRow = screen.getAllByRole('row')[2]; // Index 2 for the second data row
    // Ensure no date cell for the second event by checking for a td with rowspan
    expect(secondEventRow.querySelector('td[rowspan]')).toBeNull();

    expect(screen.getByText('Event 2 Content')).toBeInTheDocument();
    expect(screen.getByText('Idol B')).toBeInTheDocument();
    // Ensure no link button or image for this event
    expect(secondEventRow.querySelector('a')).toBeNull(); // Check for <a> tag for LinkButton
    expect(secondEventRow.querySelector('img')).toBeNull();
  });

  it('renders event on a new day correctly with date cell', () => {
    render(<LiveEventTable tableData={mockTableData} />);
    const thirdEventRow = screen.getAllByRole('row')[3]; // Index 3 for the third data row
    const dateCell = screen.getByText('7/16(水)');
    expect(dateCell).toBeInTheDocument();
    expect(dateCell.closest('td')).toHaveAttribute('rowspan', '1');

    expect(screen.getByText('Event 3 Content')).toBeInTheDocument();
    expect(screen.getByText('Idol C')).toBeInTheDocument();
    // Use getAllByRole('link') and pick the second one
    const detailLinks = screen.getAllByRole('link', { name: '詳細' });
    expect(detailLinks[1]).toHaveAttribute('href', 'http://example.com/link3');
    expect(detailLinks[1].querySelector('[data-testid="ExternalLink"]')).toBeInTheDocument();
    expect(thirdEventRow.querySelector('img')).toBeNull(); // No image for this event
  });

  it('displays "本日" badge for events on today\'s date', () => {
    render(<LiveEventTable tableData={mockTableData} />);
    const todayBadges = screen.getAllByText('本日');
    expect(todayBadges.length).toBe(1); // Only one "本日" badge for the first event of the day
    expect(todayBadges[0]).toBeInTheDocument();
  });

  it('does not display "本日" badge for events not on today\'s date', () => {
    // Create test data with only non-today events
    const nonTodayData: TableEvent[] = [
      {
        date: '2025-07-16',
        content: 'Event 3 Content',
        id: 'idol3',
        short_name: 'Idol C',
        link: 'http://example.com/link3',
        image: '',
        rowspan: 1,
        isFirstOfDay: true,
        groupIndex: 1,
        colors: { background: '#0000FF', foreground: '#FFFFFF', text: '#000000' },
        isToday: false,
      },
    ];

    render(<LiveEventTable tableData={nonTodayData} />);
    expect(screen.queryByText('本日')).not.toBeInTheDocument();
  });
});
