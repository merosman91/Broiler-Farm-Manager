import { openDB } from 'idb'

const DB_NAME = 'shamsin-db'
const DB_VER = 1

export async function getDB(){
  return openDB(DB_NAME, DB_VER, {
    upgrade(db){
      if(!db.objectStoreNames.contains('batches')){
        const store = db.createObjectStore('batches', {keyPath:'id'})
      }
      if(!db.objectStoreNames.contains('records')){
        db.createObjectStore('records', {keyPath:'rid', autoIncrement:true})
      }
      if(!db.objectStoreNames.contains('expenses')){
        db.createObjectStore('expenses', {keyPath:'id', autoIncrement:true})
      }
    }
  })
}

export async function addBatch(batch){
  const db = await getDB()
  await db.put('batches', batch)
}

export async function getBatches(){
  const db = await getDB()
  return db.getAll('batches')
}

export async function getBatch(id){
  const db = await getDB()
  return db.get('batches', id)
}

export async function saveRecord(record){
  const db = await getDB()
  return db.add('records', record)
}

export async function getRecords(batchId){
  const db = await getDB()
  return (await db.getAll('records')).filter(r => r.batchId === batchId)
}
