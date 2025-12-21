import React, { useState } from 'react'
import { FarmProvider, useFarm } from './FarmContext'

// مكون الدفعة المنفصل
function BatchForm() {
  const { dispatch } = useFarm()
  const [form, setForm] = useState({
    start_date: new Date().toISOString().split('T')[0],
    chicks: 0,
    breed: '',
    chick_price: 0,
    start_weight: 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!form.chicks || form.chicks <= 0) {
      alert('يرجى إدخال عدد صحيح من الكتاكيت')
      return
    }

    const newBatch = {
      ...form,
      id: Date.now(),
      created_at: new Date().toISOString()
    }

    // استخدام Context بدلاً من useState مباشرة
    dispatch({ type: 'ADD_BATCH', payload: newBatch })
    
    alert(`✅ تمت إضافة الدفعة بنجاح!`)
    
    setForm({
      start_date: new Date().toISOString().split('T')[0],
      chicks: 0,
      breed: '',
      chick_price: 0,
      start_weight: 0
    })
  }

  // ... نفس تصميم النموذج من الكود السابق
  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '10px' }}>
      <h2>إضافة دفعة جديدة</h2>
      {/* نفس حقول النموذج السابقة */}
    </div>
  )
}

// مكون رئيسي
function MainApp() {
  const { state } = useFarm()
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>🏭 مزرعة الدواجن</h1>
      <div style={{ background: '#eee', padding: '10px', marginBottom: '20px' }}>
        عدد الدفعات: {state.batches.length}
      </div>
      
      <BatchForm />
      
      {/* عرض الدفعات */}
      {state.batches.map((batch, index) => (
        <div key={batch.id} style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9' }}>
          دفعة #{index + 1}: {batch.breed} - {batch.chicks} كتكوت
        </div>
      ))}
    </div>
  )
}

// App الرئيسي مع Provider
function App() {
  return (
    <FarmProvider>
      <MainApp />
    </FarmProvider>
  )
}

export default App
