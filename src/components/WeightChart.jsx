>>> filename: src/components/WeightChart.jsx
import React, {useEffect, useState} from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getRecords } from '../lib/db'

export default function WeightChart({activeBatchId}){
  const [data, setData] = useState([])
  useEffect(()=>{ if(!activeBatchId) return setData([]); (async ()=>{ const rec = await getRecords(activeBatchId); const d = rec.filter(r=>r.avg_weight).map(r=>({day:r.day, weight:r.avg_weight})); setData(d.sort((a,b)=>a.day-b.day)) })() }, [activeBatchId])

  if(!activeBatchId) return null
  return (
    <div className="card">
      <h4>منحنى الوزن (عينة)</h4>
      {data.length===0 ? <p>لا توجد بيانات وزن بعد.</p> : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="weight" strokeWidth={2} /></LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
