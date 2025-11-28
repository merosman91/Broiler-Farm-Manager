import { openDB } from 'idb'

const DB_NAME = 'shamsin-db'
const DB_VERSION = 3 // زيادة الإصدار

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // الترقية من الإصدار 2 إلى 3
      if (oldVersion < 3) {
        // تحديث جدول الدفعات لإضافة الحقول المالية
        if (db.objectStoreNames.contains('batches')) {
          db.deleteObjectStore('batches')
        }
        const batchStore = db.createObjectStore('batches', { keyPath: 'id' })
        batchStore.createIndex('by-date', 'start_date')
        
        // إنشاء جداول جديدة
        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' })
          expenseStore.createIndex('by-batch', 'batchId')
          expenseStore.createIndex('by-category', 'category')
          expenseStore.createIndex('by-date', 'date')
        }
        
        if (!db.objectStoreNames.contains('incomes')) {
          const incomeStore = db.createObjectStore('incomes', { keyPath: 'id' })
          incomeStore.createIndex('by-batch', 'batchId')
          incomeStore.createIndex('by-type', 'type')
          incomeStore.createIndex('by-date', 'date')
        }
        
        if (!db.objectStoreNames.contains('inventory')) {
          const inventoryStore = db.createObjectStore('inventory', { keyPath: 'id' })
          inventoryStore.createIndex('by-type', 'type')
          inventoryStore.createIndex('by-expiry', 'expiryDate')
        }
      }
      
      if (!db.objectStoreNames.contains('records')) {
        const recordStore = db.createObjectStore('records', { keyPath: 'rid' })
        recordStore.createIndex('by-batch', 'batchId')
        recordStore.createIndex('by-day', 'day')
      }
    }
  })
}

// دوال المصروفات
export async function addExpense(expense) {
  const db = await getDB()
  const expenseWithId = {
    ...expense,
    id: expense.id || Date.now(),
    createdAt: new Date().toISOString()
  }
  return await db.add('expenses', expenseWithId)
}

export async function getExpenses(batchId = null) {
  const db = await getDB()
  const allExpenses = await db.getAll('expenses')
  if (batchId) {
    return allExpenses.filter(exp => exp.batchId === batchId)
  }
  return allExpenses
}

export async function getExpensesByCategory(batchId, category) {
  const expenses = await getExpenses(batchId)
  return expenses.filter(exp => exp.category === category)
}

// دوال الإيرادات
export async function addIncome(income) {
  const db = await getDB()
  const incomeWithId = {
    ...income,
    id: income.id || Date.now(),
    createdAt: new Date().toISOString()
  }
  return await db.add('incomes', incomeWithId)
}

export async function getIncomes(batchId = null) {
  const db = await getDB()
  const allIncomes = await db.getAll('incomes')
  if (batchId) {
    return allIncomes.filter(inc => inc.batchId === batchId)
  }
  return allIncomes
}

// دوال المخزون
export async function addInventory(item) {
  const db = await getDB()
  const itemWithId = {
    ...item,
    id: item.id || Date.now(),
    createdAt: new Date().toISOString()
  }
  return await db.add('inventory', itemWithId)
}

export async function getInventory(type = null) {
  const db = await getDB()
  const allItems = await db.getAll('inventory')
  if (type) {
    return allItems.filter(item => item.type === type)
  }
  return allItems
}

export async function updateInventory(itemId, updates) {
  const db = await getDB()
  const item = await db.get('inventory', itemId)
  if (item) {
    const updatedItem = { ...item, ...updates }
    return await db.put('inventory', updatedItem)
  }
}

// دوال الدفعات (الحالية تبقى كما هي)
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
// في src/lib/db.js أضف هذه الدالة
export const deleteBatch = async (ids) => {
  try {
    // مثال لحذف من IndexedDB
    const db = await getDB();
    const transaction = db.transaction(['records'], 'readwrite');
    const store = transaction.objectStore('records');
    
    const deletePromises = ids.map(id => store.delete(id));
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('Error in deleteBatch:', error);
    return false;
  }
};
