import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventsPage } from '../EventsPage';

// Import the actual modules to be mocked
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useEventTableData } from '@/hooks/useEventTableData';
import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';

// Mock dependencies at the top level
vi.mock('@/hooks/useLiveEvents');
vi.mock('@/hooks/useEventTableData');
vi.mock('@/components/IdolFilter');
vi.mock('@/components/LiveEventTable');

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('EventsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();

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
  });

  it('renders loading state initially', () => {
    vi.mocked(useLiveEvents).mockReturnValue({
      loading: true,
      error: null,
      idols: [],
      allEvents: [],
    });

    render(<EventsPage mode="upcoming" />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(useLiveEvents).mockReturnValue({
      loading: false,
      error: 'Test Error',
      idols: [],
      allEvents: [],
    });

    render(<EventsPage mode="upcoming" />);
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

    render(<EventsPage mode="upcoming" />);
    expect(screen.getByTestId('mock-live-event-table')).toBeInTheDocument();
    expect(screen.queryByText('今後のライブ予定はありません。')).not.toBeInTheDocument();
  });

  it('renders no events message when eventTableData is empty for upcoming mode', () => {
    render(<EventsPage mode="upcoming" />);
    expect(screen.getByText('今後のライブ予定はありません。')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-live-event-table')).not.toBeInTheDocument();
  });

  it('renders no events message when eventTableData is empty for past mode', () => {
    render(<EventsPage mode="past" />);
    expect(screen.getByText('過去のライブ履歴はありません。')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-live-event-table')).not.toBeInTheDocument();
  });

  it('loads selectedIdols from localStorage on initial render', () => {
    localStorageMock.setItem('selectedIdols', JSON.stringify(['storedIdol']));

    render(<EventsPage mode="upcoming" />);

    const idolFilter = screen.getByTestId('mock-idol-filter');
    expect(idolFilter).toHaveAttribute('data-selected-idols', JSON.stringify(['storedIdol']));
  });

  it('updates selectedIdols and localStorage when IdolFilter changes selection', async () => {
    render(<EventsPage mode="upcoming" />);

    const idolFilterButton = screen.getByText('Change Idols');
    idolFilterButton.click();

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('selectedIdols', JSON.stringify(['mockIdol1']));
    });

    const idolFilter = screen.getByTestId('mock-idol-filter');
    expect(idolFilter).toHaveAttribute('data-selected-idols', JSON.stringify(['mockIdol1']));
  });
});