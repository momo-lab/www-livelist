import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { TableEvent } from '@/types';
import { PeriodFilter } from '../PeriodFilter';

describe('PeriodFilter', () => {
  const mockEvents: TableEvent[] = [
    {
      id: '1',
      idolId: 'idol1',
      short_name: 'E1',
      date: '2024-01-01',
      content: '',
      link: '',
    },
    {
      id: '2',
      idolId: 'idol2',
      short_name: 'E2',
      date: '2024-02-01',
      content: '',
      link: '',
    },
    {
      id: '3',
      idolId: 'idol3',
      short_name: 'E3',
      date: '2023-12-31',
      content: '',
      link: '',
    },
    {
      id: '4',
      idolId: 'idol4',
      short_name: 'E4',
      date: '2023-01-01',
      content: '',
      link: '',
    },
  ];

  it('初期選択値が正しく表示される', () => {
    const mockOnSelectedYearChange = vi.fn();

    const { rerender } = render(
      <PeriodFilter onSelectedPeriodChange={mockOnSelectedYearChange} events={mockEvents} />
    );

    expect(mockOnSelectedYearChange).toHaveBeenCalledWith({ year: 2024 });

    // 2024年が選択されている状態で再レンダリング
    rerender(
      <PeriodFilter
        selectedPeriod={{ year: 2024 }}
        onSelectedPeriodChange={mockOnSelectedYearChange}
        events={mockEvents}
      />
    );

    const triggerWithYear = screen.getByRole('combobox');
    expect(triggerWithYear.textContent).toContain('2024年');
  });
});
