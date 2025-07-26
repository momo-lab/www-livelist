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
import { ExternalLink } from 'lucide-react';

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
            <TableRow key={event.id + event.date + event.content}>
              {event.isFirstOfDay && (
                <TableCell
                  rowSpan={event.rowspan}
                  className={cn(
                    `font-medium ${dateBgColor} p-2 border-r border-border text-center align-top`,
                    isLastRow && 'rounded-bl-lg'
                  )}
                >
                  <div className="inline-flex items-center justify-center w-full sticky top-[calc(var(--header-height)+0.5rem)]">
                    <div>
                      {formatter.format(new Date(event.date))}
                      {holidayName && (
                        <Badge className="px-1 my-0.5 text-xs font-normal bg-red-300 text-red-800">
                          {holidayName}
                        </Badge>
                      )}
                      {event.isToday && (
                        <Badge className="px-1 my-0.5 text-xs font-normal bg-amber-100 text-amber-800">
                          本日
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
              )}
              <TableCell className={cn(isLastRow && 'rounded-br-lg')}>
                <div className="px-4 py-2">
                  <div className="mb-2 flex justify-between items-center">
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
