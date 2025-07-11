import { useLiveEvents } from '@/hooks/useLiveEvents';
import * as React from 'react';
import { ToggleButton } from './ToggleButton';

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
        const style = isSelected
          ? {
              backgroundColor: idol.colors.background,
              color: idol.colors.foreground,
              borderColor: idol.colors.background,
            }
          : {
              backgroundColor: 'transparent',
              color: idol.colors.text,
              borderColor: idol.colors.text,
            };

        return (
          <ToggleButton
            key={idol.id}
            value={idol.id}
            label={idol.short_name}
            isSelected={isSelected}
            onToggle={onToggleIdol}
            onLongPress={onLongPressIdol}
            style={style}
          />
        );
      })}
    </div>
  );
};
