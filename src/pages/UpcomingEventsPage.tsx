import { Link } from 'react-router-dom';
import { IdolFilter } from '@/components/app/IdolFilter';
import { LiveEventTable } from '@/components/app/LiveEventTable';
import { LiveEventTableSkeleton } from '@/components/app/LiveEventTableSkeleton';
import { Button } from '@/components/ui/button';
import { useEventTableData } from '@/hooks/app/useEventTableData';
import { useSelectedIdols } from '@/hooks/app/useSelectedIdols';
import { useHeaderRight } from '@/providers/HeaderSlotsProvider';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

const headerRightNode = (
  <Button asChild className="w-20">
    <Link to="/past">過去の予定</Link>
  </Button>
);

export const UpcomingEventsPage: React.FC = () => {
  const [selectedIdols, setSelectedIdols] = useSelectedIdols();

  const { loading, error } = useLiveEvents();
  const { eventTableData } = useEventTableData('upcoming', selectedIdols);

  useHeaderRight(headerRightNode);

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
