import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LinkButton } from '@/components/ui/LinkButton';
import { ExternalLink } from 'lucide-react';
import { formatDate, getBadgeVariant } from '@/lib/utils'; // ヘルパー関数をインポート

// LiveEventとProcessedLiveEventの型定義をuseLiveEvents.tsからコピー
interface LiveEvent {
  url: string;
  name: string;
  short_name: string;
  date: string;
  content: string;
  image: string;
  link: string;
}

interface ProcessedLiveEvent extends LiveEvent {
  rowspan?: number;
  isFirstOfDay?: boolean;
  groupIndex?: number;
}

interface LiveEventTableProps {
  processedEvents: ProcessedLiveEvent[];
}

export const LiveEventTable: React.FC<LiveEventTableProps> = ({
  processedEvents,
}) => {
  return (
    <Table className="border border-gray-200 rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead className="w-fit border-r border-gray-200">日付</TableHead>
          <TableHead>イベント内容</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {processedEvents.map((event) => {
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
              key={event.url + event.date + event.content}
              className={`${
                event.groupIndex! % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`} // groupIndexで色分け
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
                      <LinkButton
                        href={event.link}
                        className="ml-auto inline-flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 me-1" />
                        詳細
                      </LinkButton>
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
};
