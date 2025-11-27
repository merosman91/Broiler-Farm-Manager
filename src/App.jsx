import React, { useEffect, useState } from 'react'
import { addBatch, getBatches } from './lib/db'
import { useFarm } from './context/FarmContext'

// مكونات مبسطة للتجربة
function SimpleFinancialManager({ activeBatchId }) {
  return (
    <div className="card" style={{ border: '3px solid #f59e0b', padding: '20px' }}>
      <h3>💰 الإدارة المالية</h3>
      <p>activeBatchId: <strong>{activeBatchId || 'لا يوجد'}</strong></p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button style={{ padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px' }}>
          إضافة مصروف
        </button>
        <button style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px' }}>
          إضافة إيراد
        </button>
      </div>
    </div>
  )
}

function SimpleShareButtons({ activeBatchId }) {
  return (
    <div className="card" style={{ border: '3px solid #3b82f6', padding: '20px' }}>
      <h3>📤 مشاركة التقرير</h3>
      <p>activeBatchId: <strong>{activeBatchId || 'لا يوجد'}</strong></p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button style={{ padding: '10px', background: '#25D366', color: 'white', border: 'none', borderRadius: '5px' }}>
          واتساب
        </button>
        <button style={{ padding: '10px', background: '#0088cc', color: 'white', border: 'none', borderRadius: '5px' }}>
          تليجرام
        </button>
      </div>
    </div>
  )
}

function SimpleExportPDF({ activeBatchId }) {
  return (
    <div className="card" style={{ border: '3px solid #ef4444', padding: '20px' }}>
      <h3>📄 تصدير PDF</h3>
      <p>activeBatchId: <strong>{activeBatchId || 'لا يوجد'}</strong></p>
      <button style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: '#ef4444', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px',
        width: '100%'
      }}>
        تصدير تقرير PDF
      </button>
    </div>
  )
}

export default function App() {
  const { state, dispatch } = useFarm()
  const [showTest, setShowTest] = useState(true)

  console.log('🔍 App rendered - activeBatchId:', state.activeBatchId)

  useEffect(() => {
    loadBatches()
  }, [])

  async function loadBatches() {
    try {
      const allBatches = await getBatches()
      dispatch({ type: 'SET_BATCHES', payload: allBatches.reverse() })
      
      if (allBatches.length > 0 && !state.activeBatchId) {
        dispatch({ type: 'SET_ACTIVE_BATCH', payload: allBatches[0].id })
      }
    } catch (error) {
      console.error('Error loading batches:', error)
    }
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: 'white',
        borderRadius: '10px',
        marginBottom: '20px',
        border: '2px solid #f59e0b'
      }}>
        <h1 style={{ margin: 0, color: '#f59e0b' }}>شمسين — إدارة مزرعة دواجن</h1>
        <button 
          onClick={() => setShowTest(!showTest)}
          style={{
            padding: '10px 15px',
            background: showTest ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showTest ? 'إخفاء التجربة' : 'إظهار التجربة'}
        </button>
      </header>

      {showTest && (
        <div style={{
          background: '#f0f9ff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '2px dashed #3b82f6'
        }}>
          <h2 style={{ color: '#3b82f6', marginTop: 0 }}>🧪 وضع التجربة</h2>
          <p>هذا يثبت أن المكونات الجديدة تعمل!</p>
          <p>activeBatchId في السياق: <strong>{state.activeBatchId || 'لا يوجد'}</strong></p>
          <p>عدد الدفعات: <strong>{state.batches.length}</strong></p>
        </div>
      )}

      {/* Main Content */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 400px', 
        gap: '20px' 
      }}>
        {/* Left Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            <h3>🐔 إدارة الدفعات</h3>
            <p>هنا ستظهر إدارة الدفعات...</p>
          </div>

          <div className="card" style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            <h3>📋 السجلات</h3>
            <p>هنا ستظهر سجلات الدفعات...</p>
          </div>

          {/* ✅ المكون الجديد */}
          <SimpleFinancialManager activeBatchId={state.activeBatchId} />
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            <h3>📊 لوحة التحكم</h3>
            <p>هنا ستظهر لوحة التحكم...</p>
          </div>

          <div className="card" style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            <h3>📈 الرسوم البيانية</h3>
            <p>هنا ستظهر الرسوم البيانية...</p>
          </div>

          {/* ✅ المكونات المنقولة للأسفل */}
          <SimpleExportPDF activeBatchId={state.activeBatchId} />
          <SimpleShareButtons activeBatchId={state.activeBatchId} />
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        color: '#6b7280',
        borderTop: '1px solid #e5e7eb'
      }}>
        © شمسين — نظام إدارة مزارع الدواجن {new Date().getFullYear()}
      </footer>
    </div>
  )
         }
