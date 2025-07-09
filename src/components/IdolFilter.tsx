import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

const FILTER_LIST = [
  { id: 'mofcro', name: 'もふクロ' },
  { id: 'girudoru', name: '新ギル' },
  { id: 'mofrurock', name: 'MofruRock' },
  { id: 'osahoto', name: '推さホト' },
];

interface IdolFilterProps {
  selectedIdols: string[];
  onToggleIdol: (idolName: string) => void;
}

export const IdolFilter: React.FC<IdolFilterProps> = ({
  selectedIdols,
  onToggleIdol,
}) => {
  return (
    <div className="my-2 flex flex-wrap gap-2">
      {FILTER_LIST.map((filter) => {
        const isSelected = selectedIdols.includes(filter.name);
        const variant = (isSelected ? filter.id : `${filter.id}-outline`) as VariantProps<typeof buttonVariants>['variant'];
        return (
          <Button
            key={filter.name}
            variant={variant}
            size="sm"
            className={cn(
              'cursor-pointer',
              !isSelected && 'opacity-70 hover:opacity-100'
            )}
            onClick={() => onToggleIdol(filter.name)}
          >
            {filter.name}
          </Button>
        );
      })}
    </div>
  );
};
