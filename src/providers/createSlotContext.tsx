import { useContext, useEffect, createContext, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export function createSlotContext() {
  interface ContextType {
    slot: ReactNode | null;
    setSlot: (slot: ReactNode) => void;
  }

  const SlotContext = createContext<ContextType | null>(null);

  interface Props {
    children: ReactNode;
  }

  function SlotProvider({ children }: Props) {
    const [slot, setSlotState] = useState<ReactNode | null>(null);
    const setSlot = useCallback((next: ReactNode | null) => {
      setSlotState(next);
    }, []);
    const value = useMemo<ContextType>(() => ({ slot, setSlot }), [slot, setSlot]);
    return <SlotContext.Provider value={value}>{children}</SlotContext.Provider>;
  }

  function useSetSlot(slot: ReactNode) {
    const ctx = useContext(SlotContext);
    if (!ctx) throw new Error('useHeaderTitle must be used within <HeaderTitleProvider />');
    useEffect(() => {
      ctx?.setSlot(slot);
      return () => ctx?.setSlot(null);
    }, [ctx, slot]);
  }

  function useSlotNode() {
    const ctx = useContext(SlotContext);
    if (!ctx) throw new Error('useHeaderTitleValue must be used within <HeaderTitleProvider />');
    return ctx.slot;
  }

  return {
    SlotProvider,
    useSetSlot,
    useSlotNode,
  } as const;
}
