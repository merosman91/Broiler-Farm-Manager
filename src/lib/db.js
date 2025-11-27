import { openDB } from 'idb'

const DB_NAME = 'shamsin-db'
const DB_VERSION = 2

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      // إنشاء الجداول إذا لم تكن موجودة
      if (!db.objectStoreNames.contains('batches')) {
        const batchStore = db.createObjectStore('batches', { keyPath: 'id' })
        batchStore.createIndex('by-date', 'start_date')
      }
      
      if (!db.objectStoreNames.contains('records')) {
        const recordStore = db.createObjectStore('records', { keyPath: 'rid' })
        recordStore.createIndex('by-batch', 'batchId')
        recordStore.createIndex('by-day', 'day')
      }
      
      if (!db.objectStoreNames.contains('expenses')) {
        db.createObjectStore('expenses', { keyPath: 'id' })
      }
    }
  })
}

export async function addBatch(batch) {
  try {
    const db = await getDB()
    await db.put('batches', batch)
    return batch.id
  } catch (error) {
    console.error('Error adding batch:', error)
    throw error
  }
}

export async function getBatches() {
  try {
    const db = await getDB()
    return await db.getAll('batches')
  } catch (error) {
    console.error('Error getting batches:', error)
    return []
  }
}

export async function getBatch(id) {
  try {
    const db = await getDB()
    return await db.get('batches', id)
  } catch (error) {
    console.error('Error getting batch:', error)
    return null
  }
}

export async function updateBatch(batch) {
  try {
    const db = await getDB()
    await db.put('batches', batch)
  } catch (error) {
    console.error('Error updating batch:', error)
    throw error
  }
}

export async function saveRecord(record) {
  try {
    const db = await getDB()
    // إضافة timestamp إذا لم يكن موجوداً
    const recordWithTime = {
      ...record,
      timestamp: record.timestamp || new Date().toISOString(),
      rid: record.rid || Date.now()
    }
    return await db.add('records', recordWithTime)
  } catch (error) {
    console.error('Error saving record:', error)
    throw error
  }
}

export async function getRecords(batchId) {
  try {
    const db = await getDB()
    const allRecords = await db.getAll('records')
    return allRecords.filter(r => r.batchId === batchId)
                     .sort((a, b) => a.day - b.day)
  } catch (error) {
    console.error('Error getting records:', error)
    return []
  }
}

export async function deleteBatch(id) {
  try {
    const db = await getDB()
    await db.delete('batches', id)
    
    // حذف السجلات المرتبطة بالدفعة
    const tx = db.transaction('records', 'readwrite')
    const store = tx.objectStore('records')
    const records = await store.index('by-batch').getAll(IDBKeyRange.only(id))
    
    for (const record of records) {
      await store.delete(record.rid)
    }
    
    await tx.done
  } catch (error) {
    console.error('Error deleting batch:', error)
    throw error
  }
                                                 } 
