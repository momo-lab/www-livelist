import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TableEvent } from '@/types';
import { useEffect, useState } from 'react';

interface PeriodFilterProps {
  selectedYear: number | null;
  onSelectedYearChange: (year: number) => void;
  onSelectedMonthChange?: (month: number | null) => void;
  events: TableEvent[];
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedYear,
  onSelectedYearChange,
  onSelectedMonthChange,
  events,
}) => {
  const [yearMonths, setYearMonths] = useState<{ [year: number]: number[] }>({});
  const [selectedValue, setSelectedValue] = useState<string>('');

  useEffect(() => {
    const yearMonthMap: { [year: number]: number[] } = {};

    events.forEach((event) => {
      const date = new Date(event.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (!yearMonthMap[year]) {
        yearMonthMap[year] = [];
      }

      if (!yearMonthMap[year].includes(month)) {
        yearMonthMap[year].push(month);
      }
    });

    // 各年の月をソート（降順）
    Object.keys(yearMonthMap).forEach((year) => {
      yearMonthMap[Number(year)].sort((a, b) => b - a);
    });

    setYearMonths(yearMonthMap);
  }, [events]);

  useEffect(() => {
    // 初期状態で最初の年を自動選択
    const years = Object.keys(yearMonths)
      .map(Number)
      .sort((a, b) => b - a);
    if (years.length > 0 && selectedYear === null) {
      onSelectedYearChange(years[0]);
      setSelectedValue(years[0].toString());
    }
  }, [yearMonths, selectedYear, onSelectedYearChange]);

  const availableYears = Object.keys(yearMonths)
    .map(Number)
    .sort((a, b) => b - a);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);

    if (value.includes('-')) {
      // 年月選択の場合
      const [year, month] = value.split('-').map(Number);
      onSelectedYearChange(year);
      onSelectedMonthChange?.(month);
    } else {
      // 年のみ選択の場合
      const year = Number(value);
      onSelectedYearChange(year);
      onSelectedMonthChange?.(null);
    }
  };

  const getDisplayValue = () => {
    if (selectedValue.includes('-')) {
      const [year, month] = selectedValue.split('-');
      return `${year}年${month}月`;
    } else if (selectedValue) {
      return `${selectedValue}年`;
    }
    return '年月で絞り込み';
  };

  return (
    <div>
      <Select value={selectedValue} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="年月で絞り込み">{getDisplayValue()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year) => [
            <SelectItem key={year} value={year.toString()}>
              {year}年
            </SelectItem>,
            ...yearMonths[year].map((month) => (
              <SelectItem key={`${year}-${month}`} value={`${year}-${month}`} className="pl-6">
                {month}月
              </SelectItem>
            )),
          ])}
        </SelectContent>
      </Select>
    </div>
  );
};
