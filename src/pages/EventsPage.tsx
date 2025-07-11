import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import React, { useEffect, useState } from 'react';

interface EventsPageProps {
  mode: 'upcoming' | 'past';
}

export const EventsPage: React.FC<EventsPageProps> = ({ mode }) => {
  // LocalStorageから初期状態を読み込むか、空の配列で初期化
  const [selectedIdols, setSelectedIdols] = useState<string[]>(() => {
    const storedSelectedIdols = localStorage.getItem('selectedIdols');
    return storedSelectedIdols ? JSON.parse(storedSelectedIdols) : [];
  });

  // selectedIdolsが変更されたらLocalStorageに保存する
  useEffect(() => {
    localStorage.setItem('selectedIdols', JSON.stringify(selectedIdols));
  }, [selectedIdols]);

  // useLiveEventsにselectedIdolsを渡す
  const { processedUpcomingEvents, processedPastEvents, idols, loading, error } =
    useLiveEvents(selectedIdols);

  // IdolFilterから選択されたアイドルリストを受け取るハンドラ
  const handleSelectedIdolsChange = (newSelectedIdols: string[]) => {
    setSelectedIdols(newSelectedIdols);
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  const eventsToDisplay = mode === 'upcoming' ? processedUpcomingEvents : processedPastEvents;
  const noEventsMessage =
    mode === 'upcoming' ? '今後のライブ予定はありません。' : '過去のライブ履歴はありません。';

  return (
    <div className="container mx-auto px-4 py-4">
      <IdolFilter
        initialSelectedIdols={selectedIdols}
        onSelectedIdolsChange={handleSelectedIdolsChange}
      />

      {eventsToDisplay.length > 0 ? (
        <LiveEventTable processedEvents={eventsToDisplay} idols={idols} />
      ) : (
        <p className="p-4 text-center">{noEventsMessage}</p>
      )}
    </div>
  );
};
