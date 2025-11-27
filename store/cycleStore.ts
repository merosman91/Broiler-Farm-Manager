// store/cycleStore.ts
import { create } from 'zustand';
import { getToday, calcCycleDay } from '@/utils/date';

export const useCycleStore = create((set, get) => ({
  startDate: getToday(),
  cycleDay: 1,
  setStartDate: (date) => {
    set({ startDate: date, cycleDay: calcCycleDay(date) });
  },
  refreshCycleDay: () => {
    const { startDate } = get();
    set({ cycleDay: calcCycleDay(startDate) });
  },
}));
