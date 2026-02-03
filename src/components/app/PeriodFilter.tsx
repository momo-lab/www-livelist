import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TableEvent } from '@/types';

interface PeriodFilterProps {
  selectedPeriod?: { year?: number; month?: number };
  onSelectedPeriodChange: (period: { year?: number; month?: number }) => void;
  events: TableEvent[];
}

type YearMonthGroup = {
  year: number;
  months: number[];
};

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onSelectedPeriodChange,
  events,
}) => {
  const [yearMonths, setYearMonths] = useState<YearMonthGroup[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>(() => {
    if (selectedPeriod?.year && selectedPeriod?.month) {
      return `${selectedPeriod.year}-${selectedPeriod.month}`;
    } else if (selectedPeriod?.year) {
      return `${selectedPeriod.year}`;
    }
    return '';
  });

  useEffect(() => {
    const yearMonths = events.reduce((acc: YearMonthGroup[], event) => {
      const date = new Date(event.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const group = acc.find((g) => g.year === year);

      if (group) {
        if (!group.months.includes(month)) {
          group.months.push(month);
        }
      } else {
        acc.push({ year, months: [month] });
      }

      return acc;
    }, []);

    setYearMonths(yearMonths);

    // 初期状態で最初の年を自動選択
    if (yearMonths.length > 0 && selectedValue === '') {
      const year = yearMonths[0].year;
      onSelectedPeriodChange({ year });
      setSelectedValue(year.toString());
    }
  }, [events, onSelectedPeriodChange, selectedValue]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);

    if (value.includes('-')) {
      // 年月選択の場合
      const [year, month] = value.split('-').map(Number);
      onSelectedPeriodChange({ year, month });
    } else {
      // 年のみ選択の場合
      const year = Number(value);
      onSelectedPeriodChange({ year, month: undefined });
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
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="年月で絞り込み">{getDisplayValue()}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {yearMonths.map((ym) => [
            <SelectItem key={ym.year} value={ym.year.toString()}>
              {ym.year}年
            </SelectItem>,
            ...ym.months.map((month) => (
              <SelectItem
                key={`${ym.year}-${month}`}
                value={`${ym.year}-${month}`}
                className="pl-6"
              >
                {month}月
              </SelectItem>
            )),
          ])}
        </SelectContent>
      </Select>
    </div>
  );
};
