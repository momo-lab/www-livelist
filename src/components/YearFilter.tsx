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
  onSelectedYearChange: (year: number | null) => void;
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
    if (selectedYear === null && years.length > 0) {
      onSelectedYearChange(years[0]);
    }
  }, [selectedYear, years, onSelectedYearChange]);

  return (
    <div>
      <Select
        value={selectedYear?.toString() ?? ''}
        onValueChange={(value) => onSelectedYearChange(value === 'all' ? null : Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="年で絞り込み" />
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
