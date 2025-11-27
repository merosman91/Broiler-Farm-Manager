import React, {useEffect, useState} from 'react'
import { getBatches, getRecords } from '../lib/db'

export default function RecordsList({batches, activeBatchId}){
  const [records, setRecords] = useState([])
  
  useEffect(() => { 
    async function fetchRecords() {
      if(activeBatchId) {
        try {
          setRecords(await getRecords(activeBatchId))
        } catch (error) {
          console.error('Error fetching records:', error)
          setRecords([])
        }
      } else {
        setRecords([])
      }
    }
    fetchRecords()
  }, [activeBatchId])

  // التحقق من أن batches موجود ومصفوفة
  const batchesList = batches || []

  return (
    <div className="card">
      <h3>الدفعات</h3>
      {batchesList.length === 0 && <p>لا توجد دفعات بعد.</p>}
      <ul className="batches-list">
        {batchesList.map(b => (
          <li key={b.id}>
            <div>
              <strong>{b.breed || '---'}</strong>
              <div>كتاكيت: {b.chicks}</div>
              <div>بدء: {b.start_date}</div>
            </div>
            <div className="buttons">
              <button onClick={() => { 
                navigator.clipboard.writeText(b.id); 
                alert('تم نسخ الـ ID'); 
              }}>نسخ ID</button>
              <button onClick={() => { 
                if(confirm('اجعل هذه الدفعة نشطة؟')) { 
                  localStorage.setItem('activeBatch', b.id); 
                  window.location.reload() 
                } 
              }}>اجعل نشطة</button>
            </div>
          </li>
        ))}
      </ul>

      <h4>سجل الدفعة (آخر 20)</h4>
      {records.length === 0 ? <p>لا توجد سجلات بعد.</p> : (
        <table style={{width:'100%'}}>
          <thead>
            <tr>
              <th>اليوم</th>
              <th>العلف (كجم)</th>
              <th>المتوسط (جم)</th>
              <th>نفوق</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(-20).map(r => (
              <tr key={r.rid}>
                <td>{r.day}</td>
                <td>{r.feed || '-'}</td>
                <td>{r.avg_weight || '-'}</td>
                <td>{r.mortality || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
                                              } 
