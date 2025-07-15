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
import type { TableEvent } from '@/types';
import { ExternalLink } from 'lucide-react';

interface LiveEventTableProps {
  tableData: TableEvent[];
}

export const LiveEventTable: React.FC<LiveEventTableProps> = ({ tableData }) => {
  return (
    <Table className="rounded-lg border border-gray-200">
      <TableHeader>
        <TableRow>
          <TableHead className="w-fit border-r border-gray-200">日付</TableHead>
          <TableHead>イベント内容</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((event) => {
          const dateObj = new Date(event.date);
          const dayOfWeek = dateObj.getDay(); // 0:日, 1:月, ..., 6:土
          const dateBgColor = dayOfWeek === 0 ? 'bg-red-100' : dayOfWeek === 6 ? 'bg-blue-100' : '';

          const badgeStyle = event.colors
            ? {
                backgroundColor: event.colors.background,
                color: event.colors.foreground,
              }
            : {};

          return (
            <TableRow
              key={event.url + event.date + event.content}
              className={`${event.groupIndex! % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`} // groupIndexで色分け
            >
              {event.isFirstOfDay && (
                <TableCell
                  rowSpan={event.rowspan}
                  className={`font-medium ${dateBgColor} w-fit border-r border-gray-200`}
                >
                  <div className="px-4 py-2">{event.formatted_date}</div>
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
                        className="h-12 w-12 rounded-lg border border-gray-200"
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
