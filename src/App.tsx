import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Tabsコンポーネントをインポート

// データの型定義
interface LiveEvent {
  url: string;
  name: string;
  short_name: string;
  date: string;
  content: string;
  image: string;
  link: string;
}

// 日付を「6/1(月)」形式にフォーマットする関数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${month}/${day}(${dayOfWeek})`;
};

// グループIDに基づいてバッジの色を決定する関数
const getBadgeVariant = (url: string): string => {
  return url.replace(/^.*\//, '');
};

function App() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('upcoming'); // activeTabの状態を追加

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました。');
        }
        const data: LiveEvent[] = await response.json();
        setEvents(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '不明なエラーが発生しました。'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // イベントを今後の予定と過去の履歴に分類し、過去の履歴をソート
  const now = new Date();
  // 時刻情報をクリアして日付のみにする
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    // イベントの日付も時刻情報をクリアして日付のみにする
    const eventDay = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    return eventDay >= today;
  });

  const pastEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const eventDay = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );
      return eventDay < today;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 日付の降順でソート

  // 日付ごとにグループ化し、rowspan情報を付与するヘルパー関数
  const processEventsForTable = (
    eventsToProcess: LiveEvent[]
  ): (LiveEvent & { rowspan?: number; isFirstOfDay?: boolean })[] => {
    return eventsToProcess.reduce(
      (
        acc: (LiveEvent & { rowspan?: number; isFirstOfDay?: boolean })[],
        event,
        index
      ) => {
        const formattedDate = formatDate(event.date);
        const prevEvent = acc[acc.length - 1];

        if (index === 0 || formattedDate !== formatDate(prevEvent.date)) {
          const dayEvents = eventsToProcess.filter(
            (e) => formatDate(e.date) === formattedDate
          );
          acc.push({ ...event, rowspan: dayEvents.length, isFirstOfDay: true });
        } else {
          acc.push({ ...event, isFirstOfDay: false });
        }
        return acc;
      },
      []
    );
  };

  const processedUpcomingEvents = processEventsForTable(upcomingEvents);
  const processedPastEvents = processEventsForTable(pastEvents);

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  const renderTable = (
    processedEvents: (LiveEvent & {
      rowspan?: number;
      isFirstOfDay?: boolean;
    })[]
  ) => (
    <Table className="border border-gray-200 rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead className="w-fit border-r border-gray-200">日付</TableHead>
          <TableHead>イベント内容</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {processedEvents.map((event, index) => {
          const dateObj = new Date(event.date);
          const dayOfWeek = dateObj.getDay(); // 0:日, 1:月, ..., 6:土
          const dateBgColor =
            dayOfWeek === 0
              ? 'bg-red-100'
              : dayOfWeek === 6
                ? 'bg-blue-100'
                : '';

          return (
            <TableRow
              key={index}
              className={`even:bg-muted cursor-pointer`}
              onClick={() => {
                if (event.link) {
                  window.open(event.link, '_blank');
                }
              }}
            >
              {event.isFirstOfDay && (
                <TableCell
                  rowSpan={event.rowspan}
                  className={`font-medium ${dateBgColor} w-fit border-r border-gray-200`}
                >
                  <div className="px-4 py-2">{formatDate(event.date)}</div>
                </TableCell>
              )}
              <TableCell>
                <div className="px-4 py-2">
                  <div className="flex items-center mb-2">
                    <Badge variant={getBadgeVariant(event.url)}>
                      {event.short_name}
                    </Badge>
                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-auto inline-flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        詳細
                      </a>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap font-sans">
                    {event.content}
                  </pre>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

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
            renderTable(processedUpcomingEvents)
          ) : (
            <p className="p-4 text-center">今後のライブ予定はありません。</p>
          )}
        </TabsContent>
        <TabsContent value="past">
          {processedPastEvents.length > 0 ? (
            renderTable(processedPastEvents)
          ) : (
            <p className="p-4 text-center">過去のライブ履歴はありません。</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
