import { IDOLS } from '@/lib/constants';
import * as React from 'react';
import { IdolFilterButton } from './IdolFilterButton';

interface IdolFilterProps {
  selectedIdols: string[];
  onToggleIdol: (idolName: string) => void;
  onLongPressIdol: (idolName: string) => void;
}

export const IdolFilter: React.FC<IdolFilterProps> = ({
  selectedIdols,
  onToggleIdol,
  onLongPressIdol,
}) => {
  return (
    <div className="my-2 flex flex-wrap gap-2">
      {IDOLS.map((filter) => {
        const isSelected = selectedIdols.includes(filter.name);
        return (
          <IdolFilterButton
            key={filter.name}
            filterId={filter.id}
            filterName={filter.name}
            isSelected={isSelected}
            onToggleIdol={onToggleIdol}
            onLongPressIdol={onLongPressIdol}
          />
        );
      })}
    </div>
  );
};
