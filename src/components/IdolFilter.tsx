import { ToggleButton } from '@/components/ui/ToggleButton';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface IdolFilterProps {
  initialSelectedIdols: string[];
  onSelectedIdolsChange: (selectedIdols: string[]) => void;
}

export const IdolFilter: React.FC<IdolFilterProps> = ({
  initialSelectedIdols,
  onSelectedIdolsChange,
}) => {
  const { idols } = useLiveEvents();
  const [selectedIdols, setSelectedIdols] = useState<string[]>(initialSelectedIdols);

  useEffect(() => {
    setSelectedIdols(initialSelectedIdols);
  }, [initialSelectedIdols]);

  useEffect(() => {
    if (idols.length > 0 && selectedIdols.length === 0) {
      setSelectedIdols(idols.map((v) => v.id));
    }
  }, [idols, selectedIdols]);

  useEffect(() => {
    console.log(selectedIdols);
    onSelectedIdolsChange(selectedIdols);
  }, [selectedIdols, onSelectedIdolsChange]);

  const handleToggleIdol = (id: string) => {
    setSelectedIdols((prevSelectedIdols) => {
      if (prevSelectedIdols.includes(id)) {
        const newSelected = prevSelectedIdols.filter((v) => v !== id);
        return newSelected.length === 0 && idols.length > 0 ? idols.map((v) => v.id) : newSelected;
      } else {
        return [...prevSelectedIdols, id];
      }
    });
  };

  const handleLongPressIdol = (id: string) => {
    setSelectedIdols([id]);
  };

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
            onToggle={handleToggleIdol}
            onLongPress={handleLongPressIdol}
            style={style}
          />
        );
      })}
    </div>
  );
};
