import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PastEventsPage } from '../PastEventsPage';
import type { TableEvent } from '@/types';

// Import the actual modules to be mocked
import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { YearFilter } from '@/components/YearFilter';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock dependencies at the top level
vi.mock('@/hooks/useLiveEvents');
vi.mock('@/hooks/useEventTableData');
vi.mock('@/components/IdolFilter');
vi.mock('@/components/LiveEventTable');
vi.mock('@/components/YearFilter');
vi.mock('@/hooks/useLocalStorage');

describe('PastEventsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mocks for each test
    vi.mocked(useLiveEvents).mockReturnValue({
      loading: false,
      error: null,
      idols: [],
      allEvents: [],
    });

    vi.mocked(useEventTableData).mockReturnValue({
      eventTableData: [],
    });
    vi.mocked(IdolFilter).mockImplementation(({ selectedIdols, onSelectedIdolsChange }) => (
      <div data-testid="mock-idol-filter" data-selected-idols={JSON.stringify(selectedIdols)}>
        <button onClick={() => onSelectedIdolsChange(['mockIdol1'])}>Change Idols</button>
      </div>
    ));
    vi.mocked(LiveEventTable).mockImplementation(({ tableData }) => (
      <div data-testid="mock-live-event-table" data-table-data={JSON.stringify(tableData)}>
        Mock Live Event Table
      </div>
    ));
    vi.mocked(YearFilter).mockImplementation(({ selectedYear, onSelectedYearChange }) => (
      <div data-testid="mock-year-filter" data-selected-year={selectedYear}>
        <button onClick={() => onSelectedYearChange(2024)}>Select 2024</button>
        <button onClick={() => onSelectedYearChange(null)}>Clear Year</button>
      </div>
    ));
    vi.mocked(useLocalStorage).mockReturnValue([[], vi.fn()]);
  });

  it('renders loading state initially', () => {
    vi.mocked(useLiveEvents).mockReturnValue({
      loading: true,
      error: null,
      idols: [],
      allEvents: [],
    });

    render(<PastEventsPage />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(useLiveEvents).mockReturnValue({
      loading: false,
      error: 'Test Error',
      idols: [],
      allEvents: [],
    });

    render(<PastEventsPage />);
    expect(screen.getByText('エラー: Test Error')).toBeInTheDocument();
  });

  it('renders LiveEventTable when data is available', () => {
    vi.mocked(useLocalStorage)
      .mockReturnValueOnce([[], vi.fn()]) // selectedIdols
      .mockReturnValueOnce([null, vi.fn()]); // selectedYear

    vi.mocked(useEventTableData).mockReturnValue({
      eventTableData: [
        {
          id: 'event1',
          content: 'Test Event',
          url: '',
          name: 'Test Event',
          short_name: '',
          date: new Date(),
          formatted_date: '',
          link: '',
        },
      ],
    });

    render(<PastEventsPage />);
    expect(screen.getByTestId('mock-live-event-table')).toBeInTheDocument();
    expect(screen.queryByText('過去のライブ履歴はありません。')).not.toBeInTheDocument();
  });

  it('renders no events message when eventTableData is empty for past mode', () => {
    vi.mocked(useLocalStorage)
      .mockReturnValueOnce([[], vi.fn()]) // selectedIdols
      .mockReturnValueOnce([null, vi.fn()]); // selectedYear

    vi.mocked(useEventTableData).mockReturnValue({
      eventTableData: [],
    });
    render(<PastEventsPage />);
    expect(screen.getByText('過去のライブ履歴はありません。')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-live-event-table')).not.toBeInTheDocument();
  });

  it('loads selectedIdols from useLocalStorage on initial render', () => {
    vi.mocked(useLocalStorage)
      .mockReturnValueOnce([['storedIdol'], vi.fn()]) // selectedIdols
      .mockReturnValueOnce([null, vi.fn()]); // selectedYear

    render(<PastEventsPage />);

    const idolFilter = screen.getByTestId('mock-idol-filter');
    expect(idolFilter).toHaveAttribute('data-selected-idols', JSON.stringify(['storedIdol']));
  });

  it('updates selectedIdols and useLocalStorage when IdolFilter changes selection', async () => {
    const mockSetSelectedIdols = vi.fn();
    vi.mocked(useLocalStorage)
      .mockReturnValueOnce([[], mockSetSelectedIdols]) // selectedIdols
      .mockReturnValueOnce([null, vi.fn()]); // selectedYear

    render(<PastEventsPage />);

    const idolFilterButton = screen.getByText('Change Idols');
    idolFilterButton.click();

    await waitFor(() => {
      expect(mockSetSelectedIdols).toHaveBeenCalledWith(['mockIdol1']);
    });

    const idolFilter = screen.getByTestId('mock-idol-filter');
    expect(idolFilter).toHaveAttribute('data-selected-idols', JSON.stringify([]));
  });

  it('updates selectedYear and filters events when YearFilter changes selection', async () => {
    const mockSetSelectedYear = vi.fn();
    vi.mocked(useLocalStorage)
      .mockReturnValueOnce([[], vi.fn()]) // selectedIdols
      .mockReturnValueOnce([null, mockSetSelectedYear]); // selectedYear

    const mockEventTableData: TableEvent[] = [
      { date: new Date('2024-01-01'), id: 'event1', url: '', name: 'Event 1', short_name: 'E1', formatted_date: '2024-01-01', content: '', link: '' },
      { date: new Date('2023-01-01'), id: 'event2', url: '', name: 'Event 2', short_name: 'E2', formatted_date: '2023-01-01', content: '', link: '' },
    ];
    vi.mocked(useEventTableData).mockReturnValue({
      eventTableData: mockEventTableData,
    });

    render(<PastEventsPage />);

    const selectYearButton = screen.getByText('Select 2024');
    selectYearButton.click();

    await waitFor(() => {
      expect(mockSetSelectedYear).toHaveBeenCalledWith(2024);
    });

    const clearYearButton = screen.getByText('Clear Year');
    clearYearButton.click();

    await waitFor(() => {
      expect(mockSetSelectedYear).toHaveBeenCalledWith(null);
    });
  });
});
