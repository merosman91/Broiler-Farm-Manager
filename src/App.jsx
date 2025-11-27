import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import BatchForm from './components/BatchForm'
import RecordsList from './components/RecordsList'
import ExportPDF from './components/ExportPDF'
import WeightChart from './components/WeightChart'
import { addBatch, getBatches } from './lib/db'

export default function App(){
  const [batches, setBatches] = useState([])
  const [activeBatchId, setActiveBatchId] = useState(null)

  useEffect(()=>{
    (async ()=>{
      const all = await getBatches()
      setBatches(all.reverse())
      if(all.length>0 && !activeBatchId) setActiveBatchId(all[0].id)
    })()
  }, [])

  async function handleAddBatch(b){
    const id = Date.now().toString()
    const batch = {...b, id}
    await addBatch(batch)
    setBatches(prev => [batch, ...prev])
    setActiveBatchId(id)
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>شمسين — إدارة مزرعة دواجن لاحم</h1>
        <div className="actions">
          <button onClick={()=>{navigator.share?.({title:'شمسين', text:'تطبيق إدارة مزرعة دواجن', url:location.href})}}>مشاركة</button>
          <button onClick={()=>{ setActiveBatchId(null) }}>دفعة جديدة</button>
        </div>
      </header>

      <main>
        <section className="left">
          <BatchForm addBatch={handleAddBatch} activeBatchId={activeBatchId} batches={batches} setActiveBatchId={setActiveBatchId} />
          <RecordsList batches={batches} activeBatchId={activeBatchId} />
          <ExportPDF activeBatchId={activeBatchId} />
        </section>

        <section className="right">
          <Dashboard batches={batches} activeBatchId={activeBatchId} />
          <WeightChart activeBatchId={activeBatchId} />
        </section>
      </main>

      <footer className="app-footer">© شمسين — {new Date().getFullYear()}</footer>
    </div>
  )
}
