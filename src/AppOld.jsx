import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import BatchForm from './components/BatchForm'
import RecordsList from './components/RecordsList'
import ExportPDF from './components/ExportPDF'
import ShareButtons from './components/ShareButtons'
import FinancialManager from './components/FinancialManager'
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
        created_at: new Date().toISOString(),
        expenses: [],
        labor: [],
        veterinarian: [],
        financials: {
          totalExpenses: 0,
          totalIncome: 0,
          netProfit: 0,
          profitMargin: 0
        }
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
                  text: 'تطبيق متكامل لإدارة مزارع الدواجن اللاحم - تتبع التكاليف، الإيرادات، والأرباح',
                  url: window.location.href
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('تم نسخ الرابط إلى الحافظة')
              }
            }}
            className="share-app-btn"
          >
            📤 مشاركة التطبيق
          </button>
          <button 
            onClick={() => setShowBatchModal(true)}
            className="new-batch-btn"
          >
            🐔 دفعة جديدة
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
          <FinancialManager activeBatchId={state.activeBatchId} />
        </section>

        <section className="right">
          <Dashboard 
            batches={state.batches}
            activeBatchId={state.activeBatchId}
          />
          <WeightChart activeBatchId={state.activeBatchId} />
          
          {/* بطاقات التصدير والمشاركة في الأسفل */}
          <ExportPDF activeBatchId={state.activeBatchId} />
          <ShareButtons activeBatchId={state.activeBatchId} />
        </section>
      </main>

      <BatchModal
        open={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onSave={handleAddBatch}
      />

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-info">
            <strong>شمسين</strong> — نظام متكامل لإدارة مزارع الدواجن
          </div>
          <div className="footer-features">
            <span>🐔 تربية</span>
            <span>💰 تمويل</span>
            <span>📊 تحليلات</span>
            <span>📈 أرباح</span>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} Shamsin Poultry Farm System
          </div>
        </div>
      </footer>

      <style jsx>{`
        .app-root {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #fff7e6 0%, #fff1f2 100%);
        }

        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 3px solid #f59e0b;
          margin-bottom: 24px;
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .app-header h1 {
          margin: 0;
          font-size: 28px;
          color: #f59e0b;
          font-weight: 800;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .actions {
          display: flex;
          gap: 12px;
        }

        .share-app-btn, .new-batch-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .share-app-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .share-app-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
        }

        .new-batch-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .new-batch-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
        }

        main {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
          flex: 1;
          margin-bottom: 24px;
        }

        .left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .app-footer {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-top: auto;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          border-top: 3px solid #f59e0b;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .footer-info {
          font-size: 16px;
          color: #374151;
          text-align: center;
        }

        .footer-info strong {
          color: #f59e0b;
        }

        .footer-features {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .footer-features span {
          background: #f8fafc;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }

        .footer-copyright {
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
        }

        /* تحسينات للاستجابة */
        @media (max-width: 1024px) {
          main {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .right {
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .app-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
            padding: 16px;
          }
          
          .app-header h1 {
            font-size: 24px;
          }
          
          .actions {
            width: 100%;
            justify-content: center;
          }
          
          .share-app-btn, .new-batch-btn {
            flex: 1;
            max-width: 200px;
          }
          
          .footer-features {
            gap: 8px;
          }
          
          .footer-features span {
            font-size: 11px;
            padding: 4px 8px;
          }
        }

        @media (max-width: 480px) {
          .app-root {
            padding: 12px;
          }
          
          .app-header h1 {
            font-size: 20px;
          }
          
          .actions {
            flex-direction: column;
            gap: 8px;
          }
          
          .share-app-btn, .new-batch-btn {
            max-width: none;
          }
          
          .footer-info {
            font-size: 14px;
          }
        }

        /* تحسينات للطابع البصري */
        .app-root::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        /* تحسينات للبطاقات */
        .left > div, .right > div {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .left > div:hover, .right > div:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        /* تحسينات للزراعة */
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .new-batch-btn {
          animation: pulse 2s infinite;
        }

        .new-batch-btn:hover {
          animation: none;
        }
      `}</style>
    </div>
  )
        }
