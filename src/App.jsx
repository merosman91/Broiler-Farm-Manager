import React, { useState } from 'react'

function App() {
  const [batches, setBatches] = useState([])
  const [form, setForm] = useState({
    start_date: new Date().toISOString().split('T')[0],
    chicks: 0,
    breed: '',
    chick_price: 0,
    start_weight: 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // التحقق الأساسي
    if (!form.chicks || form.chicks <= 0) {
      alert('يرجى إدخال عدد صحيح من الكتاكيت')
      return
    }

    // إنشاء دفعة جديدة
    const newBatch = {
      ...form,
      id: Date.now(), // معرف فريد
      created_at: new Date().toISOString()
    }

    // إضافة إلى القائمة
    setBatches([...batches, newBatch])
    
    // إظهار رسالة نجاح
    alert(`✅ تمت إضافة الدفعة بنجاح!\n\nعدد الكتاكيت: ${form.chicks}\nالسلالة: ${form.breed || 'غير محدد'}`)
    
    // إعادة تعيين النموذج
    setForm({
      start_date: new Date().toISOString().split('T')[0],
      chicks: 0,
      breed: '',
      chick_price: 0,
      start_weight: 0
    })
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>🏭 مزرعة الدواجن</h1>
      
      {/* شريط الحالة */}
      <div style={{
        background: '#3498db',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        عدد الدفعات: {batches.length} | التطبيق يعمل بشكل طبيعي
      </div>

      {/* نموذج الإضافة */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#27ae60', marginBottom: '20px' }}>إضافة دفعة جديدة</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              تاريخ البدء
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={e => setForm({...form, start_date: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              عدد الكتاكيت
            </label>
            <input
              type="number"
              value={form.chicks}
              onChange={e => setForm({...form, chicks: parseInt(e.target.value) || 0})}
              min="1"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              السلالة
            </label>
            <input
              type="text"
              value={form.breed}
              onChange={e => setForm({...form, breed: e.target.value})}
              placeholder="مثال: كوب 500"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              سعر الكتكوت (جنية)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.chick_price}
              onChange={e => setForm({...form, chick_price: parseFloat(e.target.value) || 0})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            إضافة الدفعة
          </button>
        </form>
      </div>

      {/* قائمة الدفعات */}
      {batches.length > 0 && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '15px' }}>الدفعات المضافة</h2>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {batches.map((batch, index) => (
              <div
                key={batch.id}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  background: '#f8f9fa',
                  borderLeft: '4px solid #3498db',
                  borderRadius: '5px'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  دفعة #{index + 1} - {batch.breed || 'غير محدد'}
                </div>
                <div>التاريخ: {batch.start_date}</div>
                <div>عدد الكتاكيت: {batch.chicks}</div>
                {batch.chick_price > 0 && <div>السعر: {batch.chick_price} ج.م</div>}
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setBatches([])}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            مسح الكل
          </button>
        </div>
      )}

      {/* معلومات التطبيق */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#f1c40f',
        borderRadius: '5px',
        textAlign: 'center',
        fontSize: '14px'
      }}>
        ✅ التطبيق يعمل! | {new Date().toLocaleDateString('ar-EG')}
      </div>
    </div>
  )
}

export default App
