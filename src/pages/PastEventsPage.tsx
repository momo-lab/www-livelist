import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IdolFilter } from '@/components/app/IdolFilter';
import { LiveEventTable } from '@/components/app/LiveEventTable';
import { LiveEventTableSkeleton } from '@/components/app/LiveEventTableSkeleton';
import { PeriodFilter } from '@/components/app/PeriodFilter';
import { Button } from '@/components/ui/button';
import { useFilteredEvents } from '@/hooks/app/useFilteredEvents';
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
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const { loading, error } = useLiveEvents();
  const { today, filteredEvents: rawFilteredEvents } = useFilteredEvents({
    target: 'past',
    targetIdols: selectedIdols,
    yearMonth: selectedPeriod,
  });

  const filteredEvents = useMemo(
    () => rawFilteredEvents.map(({ image: _, ...e }) => e),
    [rawFilteredEvents]
  );

  useHeaderRight(headerRightNode);

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 pb-4">
      <div className="my-2 space-y-2">
        <IdolFilter selectedIdols={selectedIdols} onSelectedIdolsChange={setSelectedIdols} />
        <PeriodFilter
          target="past"
          selectedPeriod={selectedPeriod}
          onSelectedPeriodChange={setSelectedPeriod}
        />
      </div>

      {loading ? (
        <LiveEventTableSkeleton />
      ) : filteredEvents.length > 0 ? (
        <LiveEventTable today={today} events={filteredEvents} />
      ) : (
        <p className="p-4 text-center">選択した期間に過去のライブ履歴はありません。</p>
      )}
    </div>
  );
};
