import { ExternalLink } from 'lucide-react';
import { AddToCalendarButton } from '@/components/AddToCalendarButton';
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
import { getHolidayName } from '@/lib/holidays-jp';
import { cn } from '@/lib/utils';
import type { TableEvent } from '@/types';

interface LiveEventTableProps {
  tableData: TableEvent[];
}

const formatter = Intl.DateTimeFormat('ja-JP', {
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
});

export const LiveEventTable: React.FC<LiveEventTableProps> = ({ tableData }) => {
  return (
    <Table className="border-separate border-spacing-0 rounded-lg border">
      <TableHeader className="bg-header-bg text-header-fg">
        <TableRow>
          <TableHead className="w-20 rounded-tl-lg border-r border-b text-center">日付</TableHead>
          <TableHead className="rounded-tr-lg border-b">イベント内容</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((event, i) => {
          const dayOfWeek = new Date(event.date).getDay(); // 0:日, 1:月, ..., 6:土
          const holidayName = getHolidayName(event.date);
          const dateBgColor =
            dayOfWeek === 0 || holidayName ? 'bg-red-100' : dayOfWeek === 6 ? 'bg-blue-100' : '';

          const badgeStyle = event.colors
            ? {
                backgroundColor: event.colors.background,
                color: event.colors.foreground,
              }
            : {};

          const isLastRow = i == tableData.length - (event.rowspan ?? 1);

          return (
            <TableRow key={event.id}>
              {event.isFirstOfDay && (
                <TableCell
                  rowSpan={event.rowspan}
                  className={cn(
                    `font-medium ${dateBgColor} border-r p-2 text-center align-top`,
                    isLastRow && 'rounded-bl-lg',
                    !isLastRow && 'border-b'
                  )}
                >
                  <div className="sticky top-[calc(var(--header-height)+0.5rem)] inline-flex w-full items-center justify-center">
                    <div>
                      {formatter.format(new Date(event.date))}
                      {holidayName && (
                        <Badge className="my-0.5 bg-red-300 px-1 text-xs font-normal text-red-800">
                          {holidayName}
                        </Badge>
                      )}
                      {event.isToday && (
                        <Badge className="my-0.5 bg-amber-100 px-1 text-xs font-normal text-amber-800">
                          本日
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
              )}
              <TableCell className={cn(isLastRow && 'rounded-br-lg', !isLastRow && 'border-b')}>
                <div className="px-2">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge style={badgeStyle}>{event.short_name}</Badge>
                    <div className="flex gap-3">
                      {event.link && (
                        <LinkButton href={event.link} className="inline-flex items-center">
                          <ExternalLink className="me-0.5 h-4 w-4" />
                          詳細
                        </LinkButton>
                      )}
                      <AddToCalendarButton event={event} />
                    </div>
                  </div>
                  <div className="item-start flex gap-2">
                    {event.image && (
                      <img
                        src={event.image}
                        width="48"
                        height="48"
                        className="h-12 w-12 rounded-lg border"
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
