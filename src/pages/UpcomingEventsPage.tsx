import React from 'react';
import { Link } from 'react-router-dom';
import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { LiveEventTableSkeleton } from '@/components/LiveEventTableSkeleton';
import { Button } from '@/components/ui/button';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useHeaderRight } from '@/hooks/useHeaderRight';
import { useSelectedIdols } from '@/hooks/useSelectedIdols';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

export const UpcomingEventsPage: React.FC = () => {
  const [selectedIdols, setSelectedIdols] = useSelectedIdols();

  const { loading, error } = useLiveEvents();
  const { eventTableData } = useEventTableData('upcoming', selectedIdols);

  useHeaderRight(
    <Button asChild className="w-20">
      <Link to="/past">過去の予定</Link>
    </Button>
  );

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 pb-4">
      <div className="my-2 space-y-2">
        <IdolFilter selectedIdols={selectedIdols} onSelectedIdolsChange={setSelectedIdols} />
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
