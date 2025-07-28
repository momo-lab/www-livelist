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
          <TableHead className="w-20 rounded-tl-lg border-r border-border text-center">
            日付
          </TableHead>
          <TableHead className="rounded-tr-lg">イベント内容</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(10)].map((_, i) => (
          <TableRow key={i}>
            <TableCell className="p-2 w-20 border-r border-border text-center align-top">
              <Skeleton className="h-6 w-full" />
            </TableCell>
            <TableCell>
              <div className="px-4 py-2 space-y-2">
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
