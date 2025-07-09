import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLiveEvents } from '@/hooks/useLiveEvents'; // カスタムフックをインポート
import { LiveEventTable } from '@/components/LiveEventTable'; // テーブルコンポーネントをインポート

function App() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const { processedUpcomingEvents, processedPastEvents, loading, error } =
    useLiveEvents(); // フックからデータを取得

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">アイドルライブ情報</h1>
      <p className="text-sm text-muted-foreground mb-4">
        最新のライブ情報一覧です。
      </p>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">開催予定</TabsTrigger>
          <TabsTrigger value="past">過去の履歴</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {processedUpcomingEvents.length > 0 ? (
            <LiveEventTable processedEvents={processedUpcomingEvents} /> // コンポーネントを使用
          ) : (
            <p className="p-4 text-center">今後のライブ予定はありません。</p>
          )}
        </TabsContent>
        <TabsContent value="past">
          {processedPastEvents.length > 0 ? (
            <LiveEventTable processedEvents={processedPastEvents} /> // コンポーネントを使用
          ) : (
            <p className="p-4 text-center">過去のライブ履歴はありません。</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
