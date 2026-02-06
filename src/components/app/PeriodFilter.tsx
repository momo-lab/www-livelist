import { useEffect, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilteredEvents } from '@/hooks/app/useFilteredEvents';

interface PeriodFilterProps {
  target: Parameters<typeof useFilteredEvents>[0]['target'];
  selectedPeriod?: string; // yyyy or yyyy-MM
  onSelectedPeriodChange: (period: string) => void;
}

type YearMonthGroup = {
  year: number;
  months: number[];
};

function toYearMonth(year: number, month?: number) {
  if (month) {
    const monthStr = ('0' + month.toString()).slice(-2);
    return `${year}-${monthStr}`;
  } else {
    return year.toString();
  }
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onSelectedPeriodChange,
  target,
}) => {
  const { filteredEvents } = useFilteredEvents({
    target,
    targetIdols: [],
  });

  const yearMonths = useMemo(
    () =>
      filteredEvents.reduce((acc: YearMonthGroup[], event) => {
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
      }, []),
    [filteredEvents]
  );

  useEffect(() => {
    // 初期状態で最初の年を自動選択
    if (yearMonths.length > 0 && selectedPeriod === '') {
      const year = yearMonths[0].year;
      onSelectedPeriodChange(year.toString());
    }
  }, [yearMonths, selectedPeriod, onSelectedPeriodChange]);

  const getDisplayValue = () => {
    if (!selectedPeriod) {
      return '年月で絞り込み';
    }
    if (selectedPeriod.includes('-')) {
      const [year, month] = selectedPeriod.split('-');
      return `${year}年${month}月`;
    } else {
      return `${selectedPeriod}年`;
    }
  };

  return (
    <div>
      <Select value={selectedPeriod} onValueChange={onSelectedPeriodChange}>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="年月で絞り込み">{getDisplayValue()}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {yearMonths.map(({ year, months }) => [
            <SelectItem key={year} value={toYearMonth(year)}>
              {year}年
            </SelectItem>,
            ...months.map((month) => (
              <SelectItem
                key={toYearMonth(year, month)}
                value={toYearMonth(year, month)}
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
