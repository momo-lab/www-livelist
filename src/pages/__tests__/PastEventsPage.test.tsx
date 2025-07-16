import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PastEventsPage } from '../PastEventsPage';

// Import the actual modules to be mocked
import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock dependencies at the top level
vi.mock('@/hooks/useLiveEvents');
vi.mock('@/hooks/useEventTableData');
vi.mock('@/components/IdolFilter');
vi.mock('@/components/LiveEventTable');
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
    render(<PastEventsPage />);
    expect(screen.getByText('過去のライブ履歴はありません。')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-live-event-table')).not.toBeInTheDocument();
  });

  it('loads selectedIdols from useLocalStorage on initial render', () => {
    vi.mocked(useLocalStorage).mockReturnValue([['storedIdol'], vi.fn()]);

    render(<PastEventsPage />);

    const idolFilter = screen.getByTestId('mock-idol-filter');
    expect(idolFilter).toHaveAttribute('data-selected-idols', JSON.stringify(['storedIdol']));
  });

  it('updates selectedIdols and useLocalStorage when IdolFilter changes selection', async () => {
    const mockSetSelectedIdols = vi.fn();
    vi.mocked(useLocalStorage).mockReturnValue([[], mockSetSelectedIdols]);

    render(<PastEventsPage />);

    const idolFilterButton = screen.getByText('Change Idols');
    idolFilterButton.click();

    await waitFor(() => {
      expect(mockSetSelectedIdols).toHaveBeenCalledWith(['mockIdol1']);
    });

    const idolFilter = screen.getByTestId('mock-idol-filter');
    expect(idolFilter).toHaveAttribute('data-selected-idols', JSON.stringify([]));
  });
});
