import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const MemberItemSkeleton = () => (
  <div className="flex items-center gap-4 p-3 rounded-lg border bg-card text-card-foreground">
    <Skeleton className="h-5 w-5 rounded" />
    <Skeleton className="h-6 flex-1" />
    <div className="flex gap-3">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-8" />
    </div>
  </div>
);

const GroupSectionSkeleton = ({
  memberCount,
  groupNameWidth,
}: {
  memberCount: number;
  groupNameWidth: string;
}) => (
  <section className="pt-4">
    <Skeleton className={`h-8 ${groupNameWidth} mb-4`} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: memberCount }).map((_, index) => (
        <MemberItemSkeleton key={index} />
      ))}
    </div>
  </section>
);

export const MembersPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 mx-4">
      <div className="container mx-auto space-y-8">
        <GroupSectionSkeleton memberCount={6} groupNameWidth="w-48" />
        <GroupSectionSkeleton memberCount={3} groupNameWidth="w-32" />
        <GroupSectionSkeleton memberCount={8} groupNameWidth="w-56" />
      </div>
    </div>
  );
};
