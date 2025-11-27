import React, {useMemo, useState, useEffect} from 'react'
import { getBatch, saveRecord, getRecords } from '../lib/db'

function calcSummary(batch){
  if(!batch) return {}
  const days = Math.max(1, Math.floor((Date.now() - new Date(batch.start_date).getTime())/(1000*60*60*24)))
  return {days, chicks: batch.chicks || 0}
}

export default function Dashboard({batches, activeBatchId}){
  const [active, setActive] = useState(null)
  const [records, setRecords] = useState([])

  useEffect(()=>{ (async ()=>{ if(activeBatchId){ setActive(await getBatch(activeBatchId)); setRecords(await getRecords(activeBatchId)) } else { setActive(null); setRecords([]) } })() }, [activeBatchId])

  const summary = useMemo(()=>calcSummary(active), [active])

  async function addMortality(){
    const d = prompt('أدخل عدد الوفيات اليوم')
    if(!d) return
    await saveRecord({batchId: active.id, day: summary.days, mortality: parseInt(d||0)})
    setRecords(await getRecords(active.id))
    alert('تم تسجيل الوفيات')
  }

  async function addFeed(){
    const feed = prompt('كم كمية العلف اليوم (كجم)؟')
    if(!feed) return
    await saveRecord({batchId: active.id, day: summary.days, feed: parseFloat(feed)})
    setRecords(await getRecords(active.id))
    alert('تم تسجيل العلف')
  }

  return (
    <div className="card dashboard">
      <h3>لوحة المتابعة</h3>
      {!active && <p>اختر دفعة لتعرض التفاصيل.</p>}
      {active && (
        <div>
          <div>السلالة: <strong>{active.breed}</strong></div>
          <div>العمر بالأيام: <strong>{summary.days}</strong></div>
          <div>عدد الكتاكيت: <strong>{summary.chicks}</strong></div>
          <div className="quick-actions">
            <button onClick={addMortality}>سجل وفاة</button>
            <button onClick={addFeed}>سجل علف</button>
            <button onClick={async ()=>{ const w = prompt('أدخل متوسط الوزن للعيّنة (جم)'); if(w){ await saveRecord({batchId: active.id, day: summary.days, avg_weight: parseFloat(w)}); setRecords(await getRecords(active.id)); alert('تم تسجيل الوزن') } }}>سجل وزن</button>
          </div>
        </div>
      )}
    </div>
  )
}
