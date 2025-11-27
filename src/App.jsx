import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import BatchForm from './components/BatchForm'
import RecordsList from './components/RecordsList'
import ExportPDF from './components/ExportPDF'
import WeightChart from './components/WeightChart'
import BatchModal from './components/ui/BatchModal'
import { addBatch, getBatches } from './lib/db'
import { useFarm } from './context/FarmContext'

export default function App() {
  const { state, dispatch } = useFarm()
  const [showBatchModal, setShowBatchModal] = useState(false)

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
      const batch = {
        ...batchData,
        id,
        created_at: new Date().toISOString()
      }
      
      await addBatch(batch)
      dispatch({ type: 'ADD_BATCH', payload: batch })
      setShowBatchModal(false)
    } catch (error) {
      console.error('Error adding batch:', error)
      alert('حدث خطأ أثناء إضافة الدفعة')
    }
  }

  function handleSetActiveBatch(batchId) {
    dispatch({ type: 'SET_ACTIVE_BATCH', payload: batchId })
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>شمسين — إدارة مزرعة دواجن لاحم</h1>
        <div className="actions">
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'شمسين',
                  text: 'تطبيق متكامل لإدارة مزارع الدواجن اللاحم',
                  url: window.location.href
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('تم نسخ الرابط إلى الحافظة')
              }
            }}
          >
            مشاركة
          </button>
          <button onClick={() => setShowBatchModal(true)}>
            دفعة جديدة
          </button>
        </div>
      </header>

      <main>
        <section className="left">
          <BatchForm 
            addBatch={handleAddBatch}
            activeBatchId={state.activeBatchId}
            batches={state.batches}
            setActiveBatchId={handleSetActiveBatch}
          />
          <RecordsList 
            batches={state.batches}
            activeBatchId={state.activeBatchId}
          />
          <ExportPDF activeBatchId={state.activeBatchId} />
        </section>

        <section className="right">
          <Dashboard 
            batches={state.batches}
            activeBatchId={state.activeBatchId}
          />
          <WeightChart activeBatchId={state.activeBatchId} />
        </section>
      </main>

      <BatchModal
        open={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onSave={handleAddBatch}
      />

      <footer className="app-footer">
        © شمسين — نظام إدارة مزارع الدواجن {new Date().getFullYear()}
      </footer>
    </div>
  )
          }
