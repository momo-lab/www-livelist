import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const LiveEventTableSkeleton = () => {
  return (
    <Table className="border-separate border-spacing-0 rounded-lg border">
      <TableHeader className="bg-header-bg text-header-fg">
        <TableRow>
          <TableHead className="w-20 rounded-tl-lg border-r border-b text-center">日付</TableHead>
          <TableHead className="rounded-tr-lg border-b">イベント内容</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(10)].map((_, i) => (
          <TableRow key={i}>
            <TableCell className="w-20 border-r border-b p-2 text-center align-top">
              <Skeleton className="h-6 w-full" />
            </TableCell>
            <TableCell className="border-b">
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
