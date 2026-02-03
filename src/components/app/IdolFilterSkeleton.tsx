import { Skeleton } from '@/components/ui/skeleton';

export const IdolFilterSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-20 rounded-md" />
      ))}
    </div>
  );
};
