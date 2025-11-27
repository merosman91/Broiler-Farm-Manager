// Example: store/feedStore.ts
import { create } from 'zustand';
import { dbAdd, dbGetAll } from '@/utils/db';

export const useFeedStore = create((set) => ({
  feedList: [],

  loadFeed: async () => {
    const data = await dbGetAll('feed');
    set({ feedList: data });
  },

  addFeed: async (item) => {
    await dbAdd('feed', item);
    const data = await dbGetAll('feed');
    set({ feedList: data });
  },
}));
