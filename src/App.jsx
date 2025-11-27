import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import BatchForm from './components/BatchForm'
import RecordsList from './components/RecordsList'
import ExportPDF from './components/ExportPDF'
import ShareButtons from './components/ShareButtons'
import FinancialManager from './components/FinancialManager'
import WeightChart from './components/WeightChart'
import { addBatch, getBatches } from './lib/db'
import { useFarm } from './context/FarmContext'

// مكون بسيط للتجربة
function TestFinancialManager({ activeBatchId }) {
  return (
    <div style={{
      border: '4px solid green',
      padding: '20px',
      margin: '10px 0',
      background: '#f0fdf4',
      borderRadius: '10px'
    }}>
      <h2 style={{ color: 'green' }}>✅ TEST: الإدارة المالية</h2>
      <p>activeBatchId: {activeBatchId || 'NO BATCH'}</p>
      <p>هذا مكون تجريبي بسيط</p>
    </div>
  )
}

export default function App() {
  const { state, dispatch } = useFarm()
  const [showBatchModal, setShowBatchModal] = useState(false)

  console.log('🔄 App rendered, activeBatchId:', state.activeBatchId)

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

  async function handleAddBatch(batchData) {
    try {
      const id = Date.now().toString()
      const batch = { ...batchData, id, created_at: new Date().toISOString() }
      await addBatch(batch)
      dispatch({ type: 'ADD_BATCH', payload: batch })
      setShowBatchModal(false)
    } catch (error) {
      console.error('Error adding batch:', error)
      alert('حدث خطأ أثناء إضافة الدفعة')
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>شمسين — إدارة مزرعة دواجن لاحم</h1>
        <div className="actions">
          <button onClick={() => setShowBatchModal(true)}>
            دفعة جديدة
          </button>
        </div>
      </header>

      <main>
       <section className="left">
       <BatchForm ... />
    <RecordsList ... />
    <FinancialManager activeBatchId={state.activeBatchId} /> {/* ✅ الجديد */}
  </section>

  <section className="right">
    <Dashboard ... />
    <WeightChart ... />
    
    {/* ✅ نقلت للأسفل */}
    <ExportPDF activeBatchId={state.activeBatchId} />
    <ShareButtons activeBatchId={state.activeBatchId} /> {/* ✅ الجديد */}
  </section>
</main>

      <footer className="app-footer">
        © شمسين — نظام إدارة مزارع الدواجن {new Date().getFullYear()}
      </footer>

      <style jsx>{`
        .app-root {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px;
        }
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 2px solid #f59e0b;
          margin-bottom: 24px;
        }
        main {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
        }
        .left, .right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .app-footer {
          text-align: center;
          margin-top: 24px;
          padding: 16px 0;
          color: #6b7280;
        }
      `}</style>
    </div>
  )
        }
