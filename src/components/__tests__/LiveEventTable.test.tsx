import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LiveEventTable } from '../LiveEventTable';
import type { TableEvent } from '@/types';

// Keep mock for ExternalLink as it's from a third-party icon library
vi.mock('lucide-react', () => ({
  ExternalLink: () => <svg data-testid="ExternalLink" />,
}));

const mockTableData: TableEvent[] = [
  {
    url: 'http://example.com/event1',
    date: new Date('2025-07-15T10:00:00Z'),
    content: 'Event 1 Content',
    id: 'idol1',
    short_name: 'Idol A',
    link: 'http://example.com/link1',
    image: 'http://example.com/image1.png',
    formatted_date: '2025/07/15 (火)',
    rowspan: 2,
    isFirstOfDay: true,
    groupIndex: 0,
    colors: { background: '#FF0000', foreground: '#FFFFFF', text: '#000000' },
  },
  {
    url: 'http://example.com/event2',
    date: new Date('2025-07-15T12:00:00Z'),
    content: 'Event 2 Content',
    id: 'idol2',
    short_name: 'Idol B',
    link: '', // No link
    image: '', // No image
    formatted_date: '2025/07/15 (火)',
    rowspan: undefined,
    isFirstOfDay: false,
    groupIndex: 0,
    colors: { background: '#00FF00', foreground: '#000000', text: '#000000' },
  },
  {
    url: 'http://example.com/event3',
    date: new Date('2025-07-16T14:00:00Z'),
    content: 'Event 3 Content',
    id: 'idol3',
    short_name: 'Idol C',
    link: 'http://example.com/link3',
    image: '', // No image
    formatted_date: '2025/07/16 (水)',
    rowspan: 1,
    isFirstOfDay: true,
    groupIndex: 1,
    colors: { background: '#0000FF', foreground: '#FFFFFF', text: '#000000' },
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
    const firstEventRow = screen.getAllByRole('row')[1]; // Index 1 for the first data row
    const dateCell = screen.getByText('2025/07/15 (火)');
    expect(dateCell).toBeInTheDocument();
    // Check the actual td element for rowspan
    expect(dateCell.closest('td')).toHaveAttribute('rowspan', '2');
    expect(firstEventRow).toHaveClass('bg-gray-50'); // groupIndex 0

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
    expect(secondEventRow).toHaveClass('bg-gray-50'); // groupIndex 0

    expect(screen.getByText('Event 2 Content')).toBeInTheDocument();
    expect(screen.getByText('Idol B')).toBeInTheDocument();
    // Ensure no link button or image for this event
    expect(secondEventRow.querySelector('a')).toBeNull(); // Check for <a> tag for LinkButton
    expect(secondEventRow.querySelector('img')).toBeNull();
  });

  it('renders event on a new day correctly with date cell', () => {
    render(<LiveEventTable tableData={mockTableData} />);
    const thirdEventRow = screen.getAllByRole('row')[3]; // Index 3 for the third data row
    const dateCell = screen.getByText('2025/07/16 (水)');
    expect(dateCell).toBeInTheDocument();
    expect(dateCell.closest('td')).toHaveAttribute('rowspan', '1');
    expect(thirdEventRow).toHaveClass('bg-white'); // groupIndex 1

    expect(screen.getByText('Event 3 Content')).toBeInTheDocument();
    expect(screen.getByText('Idol C')).toBeInTheDocument();
    // Use getAllByRole('link') and pick the second one
    const detailLinks = screen.getAllByRole('link', { name: '詳細' });
    expect(detailLinks[1]).toHaveAttribute('href', 'http://example.com/link3');
    expect(detailLinks[1].querySelector('[data-testid="ExternalLink"]')).toBeInTheDocument();
    expect(thirdEventRow.querySelector('img')).toBeNull(); // No image for this event
  });

  it('applies correct background color to date cell for Sunday', () => {
    const sundayEvent: TableEvent = {
      url: 'http://example.com/sunday',
      date: new Date('2025-07-13T10:00:00Z'), // Sunday
      content: 'Sunday Event',
      id: 'idol1',
      short_name: 'Idol A',
      link: '',
      image: '',
      formatted_date: '2025/07/13 (日)',
      rowspan: 1,
      isFirstOfDay: true,
      groupIndex: 2,
      colors: { background: '#FF0000', foreground: '#FFFFFF', text: '#000000' },
    };
    render(<LiveEventTable tableData={[sundayEvent]} />);
    const sundayDateCell = screen.getByText('2025/07/13 (日)');
    expect(sundayDateCell.closest('td')).toHaveClass('bg-red-100');
  });

  it('applies correct background color to date cell for Saturday', () => {
    const saturdayEvent: TableEvent = {
      url: 'http://example.com/saturday',
      date: new Date('2025-07-12T10:00:00Z'), // Saturday
      content: 'Saturday Event',
      id: 'idol1',
      short_name: 'Idol A',
      link: '',
      image: '',
      formatted_date: '2025/07/12 (土)',
      rowspan: 1,
      isFirstOfDay: true,
      groupIndex: 3,
      colors: { background: '#FF0000', foreground: '#FFFFFF', text: '#000000' },
    };
    render(<LiveEventTable tableData={[saturdayEvent]} />);
    const saturdayDateCell = screen.getByText('2025/07/12 (土)');
    expect(saturdayDateCell.closest('td')).toHaveClass('bg-blue-100');
  });
});
