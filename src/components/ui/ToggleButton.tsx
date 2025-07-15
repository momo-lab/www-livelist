import { Button } from '@/components/ui/button';
import { useLongPress } from '@/hooks/useLongPress';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface ToggleButtonProps {
  value: string;
  label: string;
  isSelected: boolean;
  onToggle: (value: string) => void;
  onLongPress: (value: string) => void;
  style?: React.CSSProperties;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  label,
  isSelected,
  onToggle,
  onLongPress,
  style,
}) => {
  const longPressEventHandlers = useLongPress({
    onLongPress: () => {
      onLongPress(value);
    },
    onClick: () => {
      onToggle(value);
    },
  });

  return (
    <Button
      key={value}
      variant={isSelected ? 'default' : 'outline'}
      size="sm"
      className={cn('border', 'cursor-pointer', 'select-none')}
      onContextMenu={(e) => e.preventDefault()}
      style={style}
      {...longPressEventHandlers}
    >
      {label}
    </Button>
  );
};
