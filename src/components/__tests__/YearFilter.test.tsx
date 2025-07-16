import type { TableEvent } from '@/types';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { YearFilter } from '../YearFilter';

describe('YearFilter', () => {
  const mockEvents: TableEvent[] = [
    {
      id: '1',
      url: '',
      name: 'Event 1',
      short_name: 'E1',
      date: new Date('2024-01-01'),
      formatted_date: '2024-01-01',
      content: '',
      link: '',
    },
    {
      id: '2',
      url: '',
      name: 'Event 2',
      short_name: 'E2',
      date: new Date('2024-02-01'),
      formatted_date: '2024-02-01',
      content: '',
      link: '',
    },
    {
      id: '3',
      url: '',
      name: 'Event 3',
      short_name: 'E3',
      date: new Date('2023-12-31'),
      formatted_date: '2023-12-31',
      content: '',
      link: '',
    },
    {
      id: '4',
      url: '',
      name: 'Event 4',
      short_name: 'E4',
      date: new Date('2023-01-01'),
      formatted_date: '2023-01-01',
      content: '',
      link: '',
    },
  ];

  it('初期選択値が正しく表示される', () => {
    const mockOnSelectedYearChange = vi.fn();

    const { rerender } = render(
      <YearFilter
        selectedYear={null}
        onSelectedYearChange={mockOnSelectedYearChange}
        events={mockEvents}
      />
    );

    expect(mockOnSelectedYearChange).toHaveBeenCalledWith(2024);

    // 2024年が選択されている状態で再レンダリング
    rerender(
      <YearFilter
        selectedYear={2024}
        onSelectedYearChange={mockOnSelectedYearChange}
        events={mockEvents}
      />
    );

    const triggerWithYear = screen.getByRole('combobox');
    expect(triggerWithYear.textContent).toContain('2024年');
  });
});
