import React, {useState, useEffect} from 'react'
import { addBatch as dbAddBatch, getBatch as dbGetBatch } from '../lib/db'

export default function BatchForm({addBatch, activeBatchId, batches, setActiveBatchId, updateBatch}){
  const empty = {start_date:'', chicks:0, breed:'', chick_price:0, start_weight:0}
  const [form, setForm] = useState(empty)

  useEffect(()=>{
    (async ()=>{
      if(activeBatchId){
        const b = await dbGetBatch(activeBatchId)
        if(b) setForm(b)
      } else setForm(empty)
    })()
  }, [activeBatchId])

  async function handleSubmit(e){
    e.preventDefault()
    if(!form.start_date || !form.chicks) return alert('ادخل تاريخ البدء وعدد الكتاكيت')
    if(activeBatchId){
      await dbAddBatch({...form, id: activeBatchId})
      alert('تم تحديث الدفعة')
    } else {
      await addBatch(form)
    }
  }

  async function addBatch(form){
    await dbAddBatch(form)
    // call parent if provided
    if(typeof addBatch === 'function') addBatch(form)
    alert('تم إضافة الدفعة')
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>الدفعة</h3>
      <label>تاريخ البدء<input type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} /></label>
      <label>عدد الكتاكيت<input type="number" value={form.chicks} onChange={e=>setForm({...form,chicks:parseInt(e.target.value||0)})} /></label>
      <label>السلالة<input value={form.breed} onChange={e=>setForm({...form,breed:e.target.value})} /></label>
      <label>سعر الكتكوت<input type="number" step="0.01" value={form.chick_price} onChange={e=>setForm({...form,chick_price:parseFloat(e.target.value||0)})} /></label>
      <label>الوزن الابتدائي (جم)<input type="number" value={form.start_weight} onChange={e=>setForm({...form,start_weight:parseFloat(e.target.value||0)})} /></label>
      <div className="row">
        <button type="submit">حفظ</button>
        <button type="button" onClick={()=>{ setActiveBatchId(null); setForm(empty) }}>جديد</button>
      </div>
    </form>
  )
}
