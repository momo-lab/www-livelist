import { render, screen, cleanup } from '@testing-library/react';
import { YearFilter } from '../YearFilter';

describe('YearFilter', () => {
  const mockEvents = [
    { date: '2024-01-01' },
    { date: '2024-02-01' },
    { date: '2023-12-31' },
    { date: '2023-01-01' },
  ];

  it('初期選択値が正しく表示される', () => {
    // 選択値なし
    render(
      <YearFilter selectedYear={null} onSelectedYearChange={() => {}} events={mockEvents} />,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('全ての年');

    // クリーンアップ
    cleanup();

    // 2024年が選択されている
    render(
      <YearFilter selectedYear={2024} onSelectedYearChange={() => {}} events={mockEvents} />,
    );
    const triggerWithYear = screen.getByRole('combobox');
    expect(triggerWithYear).toHaveTextContent('2024年');
  });
});