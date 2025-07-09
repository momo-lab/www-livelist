import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { LiveEventTable } from '@/components/LiveEventTable';
import { IdolFilter } from '@/components/IdolFilter';

function App() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
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
  const {
    processedUpcomingEvents,
    processedPastEvents,
    uniqueIdolNames,
    loading,
    error,
  } = useLiveEvents(selectedIdols);

  // uniqueIdolNamesがロードされた後に、selectedIdolsが空であれば全て選択状態にする
  useEffect(() => {
    if (uniqueIdolNames.length > 0 && selectedIdols.length === 0) {
      setSelectedIdols(uniqueIdolNames);
    }
  }, [uniqueIdolNames, selectedIdols]);

  // トグルボタンのクリックハンドラ
  const handleToggleIdol = (idolName: string) => {
    setSelectedIdols((prevSelectedIdols) => {
      if (prevSelectedIdols.includes(idolName)) {
        // 既に選択されている場合は削除
        const newSelected = prevSelectedIdols.filter(
          (name) => name !== idolName
        );
        // 全て非表示になった場合は、uniqueIdolNamesをセットして全て表示状態にする
        // ここでuniqueIdolNamesを使用することで、全てのアイドルが非表示になるのを防ぐ
        return newSelected.length === 0 && uniqueIdolNames.length > 0
          ? uniqueIdolNames
          : newSelected;
      } else {
        // 選択されていない場合は追加
        return [...prevSelectedIdols, idolName];
      }
    });
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  // 長押し時のハンドラ
  const handleLongPressIdol = (idolName: string) => {
    console.log(`longpress:${idolName}`);
    setSelectedIdols([idolName]); // 長押しされたアイドルのみを選択
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto py-4 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">開催予定</TabsTrigger>
            <TabsTrigger value="past">過去の履歴</TabsTrigger>
          </TabsList>

          <IdolFilter
            selectedIdols={selectedIdols}
            onToggleIdol={handleToggleIdol}
            onLongPressIdol={handleLongPressIdol} // 追加
          />

          <TabsContent value="upcoming">
            {processedUpcomingEvents.length > 0 ? (
              <LiveEventTable processedEvents={processedUpcomingEvents} />
            ) : (
              <p className="p-4 text-center">今後のライブ予定はありません。</p>
            )}
          </TabsContent>
          <TabsContent value="past">
            {processedPastEvents.length > 0 ? (
              <LiveEventTable processedEvents={processedPastEvents} />
            ) : (
              <p className="p-4 text-center">過去のライブ履歴はありません。</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default App;
