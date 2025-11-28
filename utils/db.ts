// ملاحظة: هذا المسار url يشير إلى الملف المصدر في المستودع — استبدل الملف الموجود في repo بالنسخة التالية

import { openDB } from 'idb';

export const dbPromise = openDB('poultry-farm-db', 1, {
  upgrade(db) {
    // أنشأت مخزن للدفعات (batches) لأن واجهة المستخدم تستخدم دفعات / cycles
    // واحتفظت بالمخازن الموجودة سابقًا
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
    // إضافة مخزن للدفعات — إن كان التطبيق يسمّيه batches
    if (!db.objectStoreNames.contains('batches')) {
      db.createObjectStore('batches', { keyPath: 'id', autoIncrement: true });
    }
  },
});

/**
 * dbSave — حفظ/تحديث سجل في المخزن (upsert)
 * يستخدم put بدلاً من add لتجنّب فشل العملية عند إرسال كائن لديه id
 */
export async function dbSave(store: string, data: any) {
  const db = await dbPromise;
  try {
    return await db.put(store, data); // put = upsert
  } catch (err) {
    console.error('dbSave error on store', store, err);
    throw err;
  }
}

/**
 * dbAdd — اسم مرن متوافق مع الاستخدام السابق (ينادي dbSave تحت الغطاء)
 */
export async function dbAdd(store: string, data: any) {
  return dbSave(store, data);
}

export async function dbGetAll(store: string) {
  const db = await dbPromise;
  try {
    return await db.getAll(store);
  } catch (err) {
    console.error('dbGetAll error on store', store, err);
    throw err;
  }
}

export async function dbClear(store: string) {
  const db = await dbPromise;
  try {
    return await db.clear(store);
  } catch (err) {
    console.error('dbClear error on store', store, err);
    throw err;
  }
}

export async function dbDelete(store: string, key: number | string) {
  const db = await dbPromise;
  try {
    return await db.delete(store, key);
  } catch (err) {
    console.error('dbDelete error on store', store, err);
    throw err;
  }
                                }
