import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import React, { useEffect, useState } from 'react';

interface EventsPageProps {
  mode: 'upcoming' | 'past';
}

export const EventsPage: React.FC<EventsPageProps> = ({ mode }) => {
  const [selectedIdols, setSelectedIdols] = useState<string[]>(() => {
    const storedSelectedIdols = localStorage.getItem('selectedIdols');
    return storedSelectedIdols ? JSON.parse(storedSelectedIdols) : [];
  });

  useEffect(() => {
    localStorage.setItem('selectedIdols', JSON.stringify(selectedIdols));
  }, [selectedIdols]);

  const { loading, error } = useLiveEvents();
  const { eventTableData } = useEventTableData(mode, selectedIdols);

  const handleSelectedIdolsChange = (newSelectedIdols: string[]) => {
    setSelectedIdols(newSelectedIdols);
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  const noEventsMessage =
    mode === 'upcoming' ? '今後のライブ予定はありません。' : '過去のライブ履歴はありません。';

  return (
    <div className="container mx-auto px-4 pb-4">
      <IdolFilter selectedIdols={selectedIdols} onSelectedIdolsChange={handleSelectedIdolsChange} />

      {eventTableData.length > 0 ? (
        <LiveEventTable tableData={eventTableData} />
      ) : (
        <p className="p-4 text-center">{noEventsMessage}</p>
      )}
    </div>
  );
};
