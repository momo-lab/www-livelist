import { useLiveEvents } from '@/hooks/useLiveEvents';
import * as React from 'react';
import { IdolFilterButton } from './IdolFilterButton';

interface IdolFilterProps {
  selectedIdols: string[];
  onToggleIdol: (id: string) => void;
  onLongPressIdol: (id: string) => void;
}

export const IdolFilter: React.FC<IdolFilterProps> = ({
  selectedIdols,
  onToggleIdol,
  onLongPressIdol,
}) => {
  const { idols } = useLiveEvents([]);

  return (
    <div className="my-2 flex flex-wrap gap-2">
      {idols.map((idol) => {
        const isSelected = selectedIdols.includes(idol.id);
        return (
          <IdolFilterButton
            key={idol.id}
            id={idol.id}
            name={idol.short_name}
            isSelected={isSelected}
            onToggleIdol={onToggleIdol}
            onLongPressIdol={onLongPressIdol}
            idolColors={idol.colors}
          />
        );
      })}
    </div>
  );
};
