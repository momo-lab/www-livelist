import * as React from 'react';
import { IdolFilterSkeleton } from '@/components/app/IdolFilterSkeleton';
import { ToggleButton } from '@/components/common/ToggleButton';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

interface IdolFilterProps {
  selectedIdols: string[];
  onSelectedIdolsChange: (selectedIdols: string[]) => void;
}

export const IdolFilter: React.FC<IdolFilterProps> = ({ selectedIdols, onSelectedIdolsChange }) => {
  const { idols: rawIdols, loading } = useLiveEvents();

  const idols = rawIdols.filter((idol) => idol.litlink_id);

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

  if (loading) {
    return <IdolFilterSkeleton />;
  }

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
