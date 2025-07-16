import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TableEvent } from '@/types';

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
      new Set(events.map((event) => new Date(event.date).getFullYear())),
    ).sort((a, b) => b - a);
    setYears(uniqueYears);
  }, [events]);

  return (
    <div className="w-[180px]">
      <Select
        value={selectedYear?.toString() ?? "all"}
        onValueChange={(value) => onSelectedYearChange(value === "all" ? null : Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="年で絞り込み" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全ての年</SelectItem>
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