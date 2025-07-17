import { Badge } from '@/components/ui/badge';
import { LinkButton } from '@/components/ui/LinkButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { TableEvent } from '@/types';
import { ExternalLink } from 'lucide-react';

interface LiveEventTableProps {
  tableData: TableEvent[];
}

export const LiveEventTable: React.FC<LiveEventTableProps> = ({ tableData }) => {
  return (
    <Table>
      <TableHeader className={cn('bg-header-bg', 'text-header-fg')}>
        <TableRow>
          <TableHead className="rounded-tl-lg w-20 border-r border-border text-center">
            日付
          </TableHead>
          <TableHead className="rounded-tr-lg">イベント内容</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((event) => {
          const dayOfWeek = event.date.getDay(); // 0:日, 1:月, ..., 6:土
          const dateBgColor = dayOfWeek === 0 ? 'bg-red-100' : dayOfWeek === 6 ? 'bg-blue-100' : '';

          const badgeStyle = event.colors
            ? {
                backgroundColor: event.colors.background,
                color: event.colors.foreground,
              }
            : {};

          return (
            <TableRow key={event.url + event.date + event.content}>
              {event.isFirstOfDay && (
                <TableCell
                  rowSpan={event.rowspan}
                  className={`font-medium ${dateBgColor} p-2 border-r border-border text-center align-top`}
                >
                  <div className="inline-flex items-center justify-center w-full sticky top-[calc(var(--header-height)+0.5rem)]">
                    <div>
                      {event.formatted_date}
                      {event.isToday && (
                        <Badge className="px-1 py-0.5 text-xs font-normal bg-amber-100 text-amber-800">
                          本日
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <div className="px-4 py-2">
                  <div className="mb-2 flex items-center">
                    <Badge style={badgeStyle}>{event.short_name}</Badge>
                    {event.link && (
                      <LinkButton href={event.link} className="ml-auto inline-flex items-center">
                        <ExternalLink className="me-1 h-4 w-4" />
                        詳細
                      </LinkButton>
                    )}
                  </div>
                  <div className="item-start flex gap-2">
                    {event.image && (
                      <img
                        src={event.image}
                        className="h-12 w-12 rounded-lg border border-border"
                      />
                    )}
                    <pre className="font-sans whitespace-pre-wrap">{event.content}</pre>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
