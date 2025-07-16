import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TableEvent } from '@/types';
import { useEffect, useState } from 'react';

interface YearFilterProps {
  selectedYear: number | null;
  onSelectedYearChange: (year: number) => void;
  events: TableEvent[];
}

export const YearFilter: React.FC<YearFilterProps> = ({
  selectedYear,
  onSelectedYearChange,
  events,
}) => {
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    const uniqueYears = Array.from(
      new Set(events.map((event) => new Date(event.date).getFullYear()))
    ).sort((a, b) => b - a);
    setYears(uniqueYears);
  }, [events]);

  useEffect(() => {
    // 初期状態で最初の年を自動選択
    if (years.length > 0 && selectedYear === null) {
      onSelectedYearChange(years[0]);
    }
  }, [years, selectedYear, onSelectedYearChange]);

  return (
    <div>
      <Select
        value={selectedYear?.toString() ?? (years.length > 0 ? years[0].toString() : '')}
        onValueChange={(value) => onSelectedYearChange(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="年で絞り込み">
            {selectedYear && years.includes(selectedYear)
              ? `${selectedYear}年`
              : years.length > 0
                ? `${years[0]}年`
                : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
