import { Button, buttonVariants } from '@/components/ui/button';
import { useLongPress } from '@/hooks/useLongPress';
import { cn } from '@/lib/utils';
import type { Idol } from '@/types';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

interface IdolFilterButtonProps {
  id: string;
  name: string;
  isSelected: boolean;
  onToggleIdol: (id: string) => void;
  onLongPressIdol: (id: string) => void;
  idolColors: Idol['colors'];
}

export const IdolFilterButton: React.FC<IdolFilterButtonProps> = ({
  id,
  name,
  isSelected,
  onToggleIdol,
  onLongPressIdol,
  idolColors,
}) => {
  const variant = (isSelected ? id : `${id}-outline`) as VariantProps<
    typeof buttonVariants
  >['variant'];

  const longPressEventHandlers = useLongPress({
    onLongPress: () => {
      onLongPressIdol(id);
    },
    onClick: () => {
      onToggleIdol(id);
    },
  });

  const style = isSelected
    ? {
        backgroundColor: idolColors.background,
        color: idolColors.foreground,
        borderColor: idolColors.text,
      }
    : {
        backgroundColor: 'transparent',
        color: idolColors.text,
        borderColor: idolColors.text,
      };

  return (
    <Button
      key={id}
      variant={variant}
      size="sm"
      className={cn('cursor-pointer', 'select-none', !isSelected && 'opacity-70 hover:opacity-100')}
      onContextMenu={(e) => e.preventDefault()}
      style={style}
      {...longPressEventHandlers}
    >
      {name}
    </Button>
  );
};
