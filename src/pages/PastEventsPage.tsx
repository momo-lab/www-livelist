import React, { useState } from 'react';
import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { LiveEventTableSkeleton } from '@/components/LiveEventTableSkeleton';
import { PeriodFilter } from '@/components/PeriodFilter';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useSelectedIdols } from '@/hooks/useSelectedIdols';

export const PastEventsPage: React.FC = () => {
  const [selectedIdols, setSelectedIdols] = useSelectedIdols();
  const [selectedPeriod, setSelectedPeriod] = useState<{ year?: number; month?: number }>({});

  const { loading, error } = useLiveEvents();
  const { eventTableData: allEventTableData } = useEventTableData('past', selectedIdols);

  const eventTableData = allEventTableData.filter((event) => {
    const date = new Date(event.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (selectedPeriod.year && year !== selectedPeriod.year) return false;
    if (selectedPeriod.month && month !== selectedPeriod.month) return false;

    return true;
  });

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 pb-4">
      <div className="my-2 space-y-2">
        <IdolFilter selectedIdols={selectedIdols} onSelectedIdolsChange={setSelectedIdols} />
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onSelectedPeriodChange={setSelectedPeriod}
          events={allEventTableData}
        />
      </div>

      {loading ? (
        <LiveEventTableSkeleton />
      ) : eventTableData.length > 0 ? (
        <LiveEventTable tableData={eventTableData} />
      ) : (
        <p className="p-4 text-center">過去のライブ履歴はありません。</p>
      )}
    </div>
  );
};
