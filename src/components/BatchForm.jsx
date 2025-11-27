import React, { useState, useEffect } from 'react'
import { updateBatch } from '../lib/db'
import { calcCycleDay } from '../lib/dateUtils'
import { useFarm } from '../context/FarmContext'

export default function BatchForm({ addBatch, activeBatchId, batches, setActiveBatchId }) {
  const { dispatch } = useFarm()
  const emptyForm = {
    start_date: new Date().toISOString().split('T')[0],
    chicks: 0,
    breed: '',
    chick_price: 0,
    start_weight: 0
  }
  
  const [form, setForm] = useState(emptyForm)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (activeBatchId) {
      const activeBatch = batches.find(b => b.id === activeBatchId)
      if (activeBatch) {
        setForm(activeBatch)
        setIsEditing(true)
      }
    } else {
      setForm(emptyForm)
      setIsEditing(false)
    }
  }, [activeBatchId, batches])

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!form.start_date || !form.chicks || form.chicks <= 0) {
      alert('يرجى إدخال تاريخ البدء وعدد الكتاكيت بشكل صحيح')
      return
    }

    try {
      if (isEditing && activeBatchId) {
        // تحديث دفعة موجودة
        const updatedBatch = { ...form, id: activeBatchId }
        await updateBatch(updatedBatch)
        dispatch({ type: 'UPDATE_BATCH', payload: updatedBatch })
        alert('تم تحديث الدفعة بنجاح')
      } else {
        // إضافة دفعة جديدة
        await addBatch(form)
      }
    } catch (error) {
      console.error('Error saving batch:', error)
      alert('حدث خطأ أثناء حفظ الدفعة')
    }
  }

  const cycleDay = calcCycleDay(form.start_date)

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'تعديل الدفعة' : 'دفعة جديدة'}</h3>
      
      <label>
        تاريخ البدء
        <input 
          type="date" 
          value={form.start_date} 
          onChange={e => setForm({...form, start_date: e.target.value})} 
          required 
        />
      </label>

      <label>
        عدد الكتاكيت
        <input 
          type="number" 
          value={form.chicks} 
          onChange={e => setForm({...form, chicks: parseInt(e.target.value || 0)})} 
          min="1"
          required 
        />
      </label>

      <label>
        السلالة
        <input 
          value={form.breed} 
          onChange={e => setForm({...form, breed: e.target.value})} 
          placeholder="مثال: كوب 500"
        />
      </label>

      <label>
        سعر الكتكوت (جنية)
        <input 
          type="number" 
          step="0.01" 
          value={form.chick_price} 
          onChange={e => setForm({...form, chick_price: parseFloat(e.target.value || 0)})} 
        />
      </label>

      <label>
        الوزن الابتدائي (جرام)
        <input 
          type="number" 
          value={form.start_weight} 
          onChange={e => setForm({...form, start_weight: parseFloat(e.target.value || 0)})} 
        />
      </label>

      {isEditing && (
        <div style={{ 
          background: '#f0f9ff', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '12px',
          border: '1px solid #bae6fd'
        }}>
          <strong>عمر الدورة: اليوم {cycleDay}</strong>
        </div>
      )}

      <div className="row">
        <button type="submit">
          {isEditing ? 'تحديث الدفعة' : 'إضافة الدفعة'}
        </button>
        <button 
          type="button" 
          onClick={() => {
            setActiveBatchId(null)
            setForm(emptyForm)
            setIsEditing(false)
          }}
        >
          جديد
        </button>
      </div>
    </form>
  )
            }
