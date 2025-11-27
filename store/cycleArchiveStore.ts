// store/cycleArchiveStore.ts
import { create } from 'zustand';

export const useCycleArchive = create((set) => ({
  archive: [],
  saveCycle: (cycleData) => set((state) => ({ archive: [...state.archive, cycleData] })),
  clearArchive: () => set({ archive: [] }),
}));
