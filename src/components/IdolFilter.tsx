import { ToggleButton } from '@/components/ui/ToggleButton';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import * as React from 'react';

interface IdolFilterProps {
  selectedIdols: string[];
  onSelectedIdolsChange: (selectedIdols: string[]) => void;
}

export const IdolFilter: React.FC<IdolFilterProps> = ({ selectedIdols, onSelectedIdolsChange }) => {
  const { idols } = useLiveEvents();

  const handleToggleIdol = (id: string) => {
    const newSelectedIdols = selectedIdols.includes(id)
      ? selectedIdols.filter((v) => v !== id)
      : [...selectedIdols, id];

    // 全て選択解除された場合、全アイドルを選択状態に戻す
    if (newSelectedIdols.length === 0 && idols.length > 0) {
      onSelectedIdolsChange(idols.map((v) => v.id));
    } else {
      onSelectedIdolsChange(newSelectedIdols);
    }
  };

  const handleLongPressIdol = (id: string) => {
    onSelectedIdolsChange([id]);
  };

  return (
    <div className="flex flex-wrap gap-2">
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
            onToggle={handleToggleIdol}
            onLongPress={handleLongPressIdol}
            style={style}
          />
        );
      })}
    </div>
  );
};
