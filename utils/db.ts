// utils/db.ts
import { openDB } from 'idb';

export const dbPromise = openDB('poultry-farm-db', 1, {
  upgrade(db) {
    db.createObjectStore('feed', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('weights', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('mortality', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('cycles', { keyPath: 'id', autoIncrement: true });
  },
});

export async function dbAdd(store, data) {
  const db = await dbPromise;
  return db.add(store, data);
}

export async function dbGetAll(store) {
  const db = await dbPromise;
  return db.getAll(store);
}

export async function dbClear(store) {
  const db = await dbPromise;
  return db.clear(store);
}
