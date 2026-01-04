import { useCallback, useRef } from 'react';

interface LongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
}

export const useLongPress = ({ onLongPress, onClick, delay = 500 }: LongPressOptions) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClickable = useRef(false);

  const start = useCallback(() => {
    isClickable.current = true;
    timerRef.current = setTimeout(() => {
      isClickable.current = false;
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isClickable.current = false; // clearが呼ばれたら常にfalseにする
  }, []); // onClickへの依存を削除

  const handlePointerUp = useCallback(() => {
    if (isClickable.current && onClick) {
      onClick();
    }
    clear();
  }, [onClick, clear]);

  return {
    onPointerDown: start,
    onPointerUp: handlePointerUp,
    onPointerLeave: clear,
    onPointerCancel: clear,
  };
};
