import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { useLongPress } from '@/hooks/useLongPress';

interface IdolFilterButtonProps {
  filterId: string;
  filterName: string;
  isSelected: boolean;
  onToggleIdol: (idolName: string) => void;
  onLongPressIdol: (idolName: string) => void;
}

export const IdolFilterButton: React.FC<IdolFilterButtonProps> = ({
  filterId,
  filterName,
  isSelected,
  onToggleIdol,
  onLongPressIdol,
}) => {
  const variant = (
    isSelected ? filterId : `${filterId}-outline`
  ) as VariantProps<typeof buttonVariants>['variant'];

  const longPressEventHandlers = useLongPress({
    onLongPress: () => {
      onLongPressIdol(filterName);
    },
    onClick: () => {
      onToggleIdol(filterName);
    },
  });

  return (
    <Button
      key={filterName}
      variant={variant}
      size="sm"
      className={cn(
        'cursor-pointer',
        'select-none',
        !isSelected && 'opacity-70 hover:opacity-100'
      )}
      onContextMenu={(e) => e.preventDefault()}
      {...longPressEventHandlers}
    >
      {filterName}
    </Button>
  );
};
