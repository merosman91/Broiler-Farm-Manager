import { openDB } from 'idb';

export const dbPromise = openDB('poultry-farm-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('feed')) {
      db.createObjectStore('feed', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('weights')) {
      db.createObjectStore('weights', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('mortality')) {
      db.createObjectStore('mortality', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('cycles')) {
      db.createObjectStore('cycles', { keyPath: 'id', autoIncrement: true });
    }
    // تأكّدت من وجود مخزن للدفعات باسم batches
    if (!db.objectStoreNames.contains('batches')) {
      db.createObjectStore('batches', { keyPath: 'id', autoIncrement: true });
    }
  },
});

/**
 * dbSave - يستخدم put (upsert) لتجنب خطأ عند وجود id مُسبق
 */
export async function dbSave(store, data) {
  const db = await dbPromise;
  try {
    return await db.put(store, data);
  } catch (err) {
    console.error('dbSave error on store', store, err);
    throw err;
  }
}

export async function dbAdd(store, data) {
  // wrapper متوافق مع الاستخدامات السابقة
  return dbSave(store, data);
}

export async function dbGetAll(store) {
  const db = await dbPromise;
  try {
    return await db.getAll(store);
  } catch (err) {
    console.error('dbGetAll error on store', store, err);
    throw err;
  }
}

export async function dbClear(store) {
  const db = await dbPromise;
  try {
    return await db.clear(store);
  } catch (err) {
    console.error('dbClear error on store', store, err);
    throw err;
  }
}

export async function dbDelete(store, key) {
  const db = await dbPromise;
  try {
    return await db.delete(store, key);
  } catch (err) {
    console.error('dbDelete error on store', store, err);
    throw err;
  }
}