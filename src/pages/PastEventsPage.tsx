import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IdolFilter } from '@/components/app/IdolFilter';
import { LiveEventTable } from '@/components/app/LiveEventTable';
import { LiveEventTableSkeleton } from '@/components/app/LiveEventTableSkeleton';
import { PeriodFilter } from '@/components/app/PeriodFilter';
import { Button } from '@/components/ui/button';
import { useEventTableData } from '@/hooks/app/useEventTableData';
import { useSelectedIdols } from '@/hooks/app/useSelectedIdols';
import { useHeaderRight } from '@/providers/HeaderSlotsProvider';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

const headerRightNode = (
  <Button asChild className="w-20">
    <Link to="/">開催予定</Link>
  </Button>
);

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

  useHeaderRight(headerRightNode);

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
