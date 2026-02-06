import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { mockTableEvents } from '@/__mocks__';
import type { TableEvent } from '@/types';
import { PeriodFilter } from '../PeriodFilter';

describe('PeriodFilter', () => {
  // mockTableEvents を PeriodFilter の events プロップとして利用
  const eventsForPeriodFilter = mockTableEvents.filter(
    (event) => new Date(event.date) < new Date('2025-07-15T00:00:00Z')
  ) as TableEvent[];

  it('初期選択値が正しく表示される', () => {
    const mockOnSelectedPeriodChange = vi.fn();

    const { rerender } = render(
      <PeriodFilter
        onSelectedPeriodChange={mockOnSelectedPeriodChange}
        events={eventsForPeriodFilter}
      />
    );

    // mockProcessedEvents の日付を考慮して、2025年が最新となるため初期値として期待
    expect(mockOnSelectedPeriodChange).toHaveBeenCalledWith({ year: 2025 });

    // 2024年が選択されている状態で再レンダリング
    rerender(
      <PeriodFilter
        selectedPeriod={{ year: 2025 }}
        onSelectedPeriodChange={mockOnSelectedPeriodChange}
        events={eventsForPeriodFilter}
      />
    );

    const triggerWithYear = screen.getByRole('combobox');
    expect(triggerWithYear.textContent).toContain('2025年');
  });
});
