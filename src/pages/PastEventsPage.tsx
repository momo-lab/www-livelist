import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { YearFilter } from '@/components/YearFilter';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import React, { useState } from 'react';

export const PastEventsPage: React.FC = () => {
  const [selectedIdols, setSelectedIdols] = useLocalStorage<string[]>('selectedIdols', []);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { loading, error } = useLiveEvents();
  const { eventTableData: allEventTableData } = useEventTableData('past', selectedIdols);

  const eventTableData = selectedYear
    ? allEventTableData.filter((event) => new Date(event.date).getFullYear() === selectedYear)
    : allEventTableData;

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
      <div>
        <IdolFilter
          selectedIdols={selectedIdols}
          onSelectedIdolsChange={handleSelectedIdolsChange}
        />
        <YearFilter
          selectedYear={selectedYear}
          onSelectedYearChange={setSelectedYear}
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
