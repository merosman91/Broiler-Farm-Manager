import React, { useState, useEffect } from 'react'
import { updateBatch } from '../lib/db'
import { calcCycleDay } from '../lib/dateUtils'
import { useFarm } from '../context/FarmContext'

export default function BatchForm({ addBatch, activeBatchId, batches, setActiveBatchId }) {
  const { dispatch } = useFarm()
  const [form, setForm] = useState({
    start_date: new Date().toISOString().split('T')[0],
    chicks: 0,
    breed: '',
    chick_price: 0,
    start_weight: 0
  })
  const [isEditing, setIsEditing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('') // جديد: لعرض الأخطاء

  useEffect(() => {
    console.log('Active Batch ID changed:', activeBatchId)
    console.log('Batches data:', batches)
    
    if (activeBatchId && batches && Array.isArray(batches)) {
      const activeBatch = batches.find(b => b.id === activeBatchId)
      console.log('Found batch:', activeBatch)
      
      if (activeBatch) {
        setForm({
          start_date: activeBatch.start_date || new Date().toISOString().split('T')[0],
          chicks: activeBatch.chicks || 0,
          breed: activeBatch.breed || '',
          chick_price: activeBatch.chick_price || 0,
          start_weight: activeBatch.start_weight || 0
        })
        setIsEditing(true)
        setErrorMessage('') // مسح أي أخطاء سابقة
      }
    } else {
      setForm({
        start_date: new Date().toISOString().split('T')[0],
        chicks: 0,
        breed: '',
        chick_price: 0,
        start_weight: 0
      })
      setIsEditing(false)
    }
  }, [activeBatchId, batches])

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('') // مسح الأخطاء السابقة
    
    // التحقق من البيانات
    if (!form.start_date) {
      setErrorMessage('يرجى إدخال تاريخ البدء')
      return
    }
    
    if (!form.chicks || form.chicks <= 0) {
      setErrorMessage('يرجى إدخال عدد صحيح من الكتاكيت')
      return
    }

    try {
      // إظهار رسالة تحميل
      setErrorMessage('جاري الحفظ...')
      
      if (isEditing && activeBatchId) {
        // تحديث دفعة موجودة
        const updatedBatch = { 
          ...form, 
          id: activeBatchId,
          updated_at: new Date().toISOString()
        }
        
        console.log('Updating batch:', updatedBatch)
        await updateBatch(updatedBatch)
        dispatch({ type: 'UPDATE_BATCH', payload: updatedBatch })
        setErrorMessage('✅ تم تحديث الدفعة بنجاح')
        
        // إخفاء الرسالة بعد 3 ثواني
        setTimeout(() => setErrorMessage(''), 3000)
        
      } else {
        // إضافة دفعة جديدة
        console.log('Adding new batch:', form)
        
        // التحقق من وجود دالة addBatch
        if (!addBatch || typeof addBatch !== 'function') {
          throw new Error('دالة الإضافة غير متوفرة')
        }
        
        // إضافة تاريخ الإنشاء
        const newBatch = {
          ...form,
          created_at: new Date().toISOString()
        }
        
        await addBatch(newBatch)
        setErrorMessage('✅ تمت إضافة الدفعة بنجاح')
        
        // إعادة تعيين النموذج
        setForm({
          start_date: new Date().toISOString().split('T')[0],
          chicks: 0,
          breed: '',
          chick_price: 0,
          start_weight: 0
        })
        
        // إخفاء الرسالة بعد 3 ثواني
        setTimeout(() => setErrorMessage(''), 3000)
      }
      
    } catch (error) {
      console.error('Error saving batch:', error)
      setErrorMessage(`❌ خطأ: ${error.message || 'حدث خطأ غير معروف'}`)
    }
  }

  const cycleDay = calcCycleDay(form.start_date)

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'تعديل الدفعة' : 'دفعة جديدة'}</h3>
      
      {/* عرض رسائل الخطأ والنجاح */}
      {errorMessage && (
        <div style={{
          background: errorMessage.includes('✅') ? '#d4edda' : '#f8d7da',
          color: errorMessage.includes('✅') ? '#155724' : '#721c24',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '12px',
          border: `1px solid ${errorMessage.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {errorMessage}
        </div>
      )}
      
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
          value={form.chicks || ''} 
          onChange={e => setForm({...form, chicks: parseInt(e.target.value) || 0})} 
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
          value={form.chick_price || ''} 
          onChange={e => setForm({...form, chick_price: parseFloat(e.target.value) || 0})} 
        />
      </label>

      <label>
        الوزن الابتدائي (جرام)
        <input 
          type="number" 
          value={form.start_weight || ''} 
          onChange={e => setForm({...form, start_weight: parseFloat(e.target.value) || 0})} 
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
            setForm({
              start_date: new Date().toISOString().split('T')[0],
              chicks: 0,
              breed: '',
              chick_price: 0,
              start_weight: 0
            })
            setIsEditing(false)
            setErrorMessage('')
          }}
        >
          جديد
        </button>
      </div>
    </form>
  )
          }
