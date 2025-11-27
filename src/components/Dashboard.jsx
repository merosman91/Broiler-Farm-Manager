import React, { useMemo, useState, useEffect } from 'react'
import { getBatch, saveRecord, getRecords } from '../lib/db'
import { calcCycleDay } from '../lib/dateUtils'
import { useFarm } from '../context/FarmContext'
import FeedModal from './ui/FeedModal'
import WeightModal from './ui/WeightModal'
import MortalityModal from './ui/MortalityModal'
import Toast from './ui/Toast'

function calcSummary(batch, records = []) {
  if (!batch) return {}
  
  const days = calcCycleDay(batch.start_date)
  const totalMortality = records.reduce((sum, r) => sum + (r.mortality || 0), 0)
  const totalFeed = records.reduce((sum, r) => sum + (r.feed || 0), 0)
  const currentChicks = Math.max(0, (batch.chicks || 0) - totalMortality)
  
  return { 
    days, 
    totalChicks: batch.chicks || 0,
    currentChicks,
    totalMortality,
    totalFeed 
  }
}

export default function Dashboard({ batches, activeBatchId }) {
  const { state, dispatch } = useFarm()
  const [activeBatch, setActiveBatch] = useState(null)
  const [records, setRecords] = useState([])
  const [toast, setToast] = useState(null)

  const modals = state.modals || {}

  useEffect(() => {
    if (activeBatchId) {
      loadBatchData()
    } else {
      setActiveBatch(null)
      setRecords([])
    }
  }, [activeBatchId])

  async function loadBatchData() {
    try {
      const [batch, batchRecords] = await Promise.all([
        getBatch(activeBatchId),
        getRecords(activeBatchId)
      ])
      setActiveBatch(batch)
      setRecords(batchRecords)
      dispatch({ type: 'SET_RECORDS', payload: batchRecords })
    } catch (error) {
      console.error('Error loading batch data:', error)
      showToast('حدث خطأ في تحميل البيانات', 'error')
    }
  }

  const summary = useMemo(() => calcSummary(activeBatch, records), [activeBatch, records])

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  function hideToast() {
    setToast(null)
  }

  async function handleAddMortality(count) {
    if (!activeBatch) return
    
    try {
      await saveRecord({
        batchId: activeBatch.id,
        day: summary.days,
        mortality: parseInt(count),
        timestamp: new Date().toISOString()
      })
      await loadBatchData()
      showToast('تم تسجيل الوفيات بنجاح')
    } catch (error) {
      console.error('Error saving mortality:', error)
      showToast('حدث خطأ في تسجيل الوفيات', 'error')
    }
  }

  async function handleAddFeed(amount) {
    if (!activeBatch) return
    
    try {
      await saveRecord({
        batchId: activeBatch.id,
        day: summary.days,
        feed: parseFloat(amount),
        timestamp: new Date().toISOString()
      })
      await loadBatchData()
      showToast('تم تسجيل العلف بنجاح')
    } catch (error) {
      console.error('Error saving feed:', error)
      showToast('حدث خطأ في تسجيل العلف', 'error')
    }
  }

  async function handleAddWeight(weight) {
    if (!activeBatch) return
    
    try {
      await saveRecord({
        batchId: activeBatch.id,
        day: summary.days,
        avg_weight: parseFloat(weight),
        timestamp: new Date().toISOString()
      })
      await loadBatchData()
      showToast('تم تسجيل الوزن بنجاح')
    } catch (error) {
      console.error('Error saving weight:', error)
      showToast('حدث خطأ في تسجيل الوزن', 'error')
    }
  }

  if (!activeBatchId) {
    return (
      <div className="card dashboard">
        <h3>لوحة المتابعة</h3>
        <p>يرجى اختيار دفعة لعرض التفاصيل</p>
      </div>
    )
  }

  if (!activeBatch) {
    return (
      <div className="card dashboard">
        <h3>لوحة المتابعة</h3>
        <p>جاري تحميل البيانات...</p>
      </div>
    )
  }

  return (
    <div className="card dashboard">
      <Toast 
        message={toast?.message} 
        type={toast?.type} 
        onClose={hideToast}
      />

      <FeedModal
        open={modals.feed}
        onClose={() => dispatch({ type: 'HIDE_MODAL', payload: 'feed' })}
        onSave={handleAddFeed}
      />

      <WeightModal
        open={modals.weight}
        onClose={() => dispatch({ type: 'HIDE_MODAL', payload: 'weight' })}
        onSave={handleAddWeight}
      />

      <MortalityModal
        open={modals.mortality}
        onClose={() => dispatch({ type: 'HIDE_MODAL', payload: 'mortality' })}
        onSave={handleAddMortality}
      />

      <h3>لوحة المتابعة - {activeBatch.breed || 'غير محدد'}</h3>
      
      <div className="dashboard-summary">
        <div className="summary-item">
          <span>السلالة:</span>
          <strong>{activeBatch.breed || '---'}</strong>
        </div>
        
        <div className="summary-item">
          <span>العمر:</span>
          <strong>{summary.days} يوم</strong>
        </div>
        
        <div className="summary-item">
          <span>الكتاكيت:</span>
          <strong>{summary.currentChicks} / {summary.totalChicks}</strong>
        </div>
        
        <div className="summary-item">
          <span>إجمالي النفوق:</span>
          <strong>{summary.totalMortality}</strong>
        </div>
        
        <div className="summary-item">
          <span>إجمالي العلف:</span>
          <strong>{summary.totalFeed.toFixed(1)} كجم</strong>
        </div>
      </div>

      <div className="quick-actions">
        <button onClick={() => dispatch({ type: 'SHOW_MODAL', payload: 'mortality' })}>
          تسجيل وفاة
        </button>
        <button onClick={() => dispatch({ type: 'SHOW_MODAL', payload: 'feed' })}>
          تسجيل علف
        </button>
        <button onClick={() => dispatch({ type: 'SHOW_MODAL', payload: 'weight' })}>
          تسجيل وزن
        </button>
      </div>

      <style jsx>{`
        .dashboard-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 16px 0;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .summary-item span {
          color: #64748b;
          font-size: 14px;
        }
        
        .summary-item strong {
          color: #1e293b;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
    }
