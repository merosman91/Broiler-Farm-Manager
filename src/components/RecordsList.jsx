import React, {useEffect, useState} from 'react'
import { getBatches, getRecords } from '../lib/db'

export default function RecordsList({batches, activeBatchId}){
  const [records, setRecords] = useState([])
  useEffect(()=>{ (async ()=>{ if(activeBatchId) setRecords(await getRecords(activeBatchId)) else setRecords([]) })() }, [activeBatchId])

  return (
    <div className="card">
      <h3>الدفعات</h3>
      {batches.length===0 && <p>لا توجد دفعات بعد.</p>}
      <ul className="batches-list">
        {batches.map(b=> (
          <li key={b.id}>
            <div>
              <strong>{b.breed || '---'}</strong>
              <div>كتاكيت: {b.chicks}</div>
              <div>بدء: {b.start_date}</div>
            </div>
            <div className="buttons">
              <button onClick={()=>{ navigator.clipboard.writeText(b.id); alert('تم نسخ الـ ID'); }}>نسخ ID</button>
              <button onClick={()=>{ if(confirm('اجعل هذه الدفعة نشطة؟')) { localStorage.setItem('activeBatch', b.id); window.location.reload() } }}>اجعل نشطة</button>
            </div>
          </li>
        ))}
      </ul>

      <h4>سجل الدفعة (آخر 20)</h4>
      {records.length===0 ? <p>لا توجد سجلات بعد.</p> : (
        <table style={{width:'100%'}}>
          <thead><tr><th>اليوم</th><th>العلف (كجم)</th><th>المتوسط (جم)</th><th>نفوق</th></tr></thead>
          <tbody>
            {records.slice(-20).map(r=> (
              <tr key={r.rid}><td>{r.day}</td><td>{r.feed||'-'}</td><td>{r.avg_weight||'-'}</td><td>{r.mortality||0}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
