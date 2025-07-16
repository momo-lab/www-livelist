import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { PeriodFilter } from '@/components/PeriodFilter';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import React, { useState } from 'react';

export const PastEventsPage: React.FC = () => {
  const [selectedIdols, setSelectedIdols] = useLocalStorage<string[]>('selectedIdols', []);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const { loading, error } = useLiveEvents();
  const { eventTableData: allEventTableData } = useEventTableData('past', selectedIdols);

  const eventTableData = allEventTableData.filter((event) => {
    const date = new Date(event.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (selectedYear && year !== selectedYear) return false;
    if (selectedMonth && month !== selectedMonth) return false;

    return true;
  });

  const handleSelectedIdolsChange = (newSelectedIdols: string[]) => {
    setSelectedIdols(newSelectedIdols);
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 pb-4">
      <div className="space-y-2 my-2">
        <IdolFilter
          selectedIdols={selectedIdols}
          onSelectedIdolsChange={handleSelectedIdolsChange}
        />
        <PeriodFilter
          selectedYear={selectedYear}
          onSelectedYearChange={setSelectedYear}
          onSelectedMonthChange={setSelectedMonth}
          events={allEventTableData}
        />
      </div>

      {eventTableData.length > 0 ? (
        <LiveEventTable tableData={eventTableData} />
      ) : (
        <p className="p-4 text-center">過去のライブ履歴はありません。</p>
      )}
    </div>
  );
};
