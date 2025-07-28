import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { LiveEventTableSkeleton } from '@/components/LiveEventTableSkeleton';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import React from 'react';

export const UpcomingEventsPage: React.FC = () => {
  const [selectedIdols, setSelectedIdols] = useLocalStorage<string[]>('selectedIdols', []);

  const { loading, error } = useLiveEvents();
  const { eventTableData } = useEventTableData('upcoming', selectedIdols);

  const handleSelectedIdolsChange = (newSelectedIdols: string[]) => {
    setSelectedIdols(newSelectedIdols);
  };

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
      </div>

      {loading ? (
        <LiveEventTableSkeleton />
      ) : eventTableData.length > 0 ? (
        <LiveEventTable tableData={eventTableData} />
      ) : (
        <p className="p-4 text-center">今後のライブ予定はありません。</p>
      )}
    </div>
  );
};
