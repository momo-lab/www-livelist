import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export const LiveEventTableSkeleton = () => {
  return (
    <Table>
      <TableHeader className={cn('bg-header-bg', 'text-header-fg')}>
        <TableRow>
          <TableHead className="border-border w-20 rounded-tl-lg border-r text-center">
            日付
          </TableHead>
          <TableHead className="rounded-tr-lg">イベント内容</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(10)].map((_, i) => (
          <TableRow key={i}>
            <TableCell className="border-border w-20 border-r p-2 text-center align-top">
              <Skeleton className="h-6 w-full" />
            </TableCell>
            <TableCell>
              <div className="space-y-2 px-4 py-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
