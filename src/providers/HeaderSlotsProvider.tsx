import type { ReactNode } from 'react';
import { createSlotContext } from '@/providers/createSlotContext';

export const HeaderTitleSlot = createSlotContext();
export const HeaderRightSlot = createSlotContext();

interface Props {
  children: ReactNode;
}

export function HeaderSlotsProvider({ children }: Props) {
  return (
    <HeaderRightSlot.SlotProvider>
      <HeaderTitleSlot.SlotProvider>{children}</HeaderTitleSlot.SlotProvider>
    </HeaderRightSlot.SlotProvider>
  );
}

export function useHeaderTitle(node: ReactNode) {
  return HeaderTitleSlot.useSetSlot(node);
}

export function useHeaderRight(node: ReactNode) {
  return HeaderRightSlot.useSetSlot(node);
}
