import React, { useEffect, useState } from 'react'
import { getRecords, deleteBatch } from '../lib/db'
import { useFarm } from '../context/FarmContext'
import { formatDate } from '../lib/dateUtils'

export default function RecordsList({ batches, activeBatchId }) {
  const { state, dispatch } = useFarm()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeBatchId) {
      loadRecords()
    } else {
      setRecords([])
    }
  }, [activeBatchId])

  async function loadRecords() {
    setLoading(true)
    try {
      const batchRecords = await getRecords(activeBatchId)
      setRecords(batchRecords)
    } catch (error) {
      console.error('Error loading records:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteBatch(batchId) {
    if (!confirm('هل أنت متأكد من حذف هذه الدفعة؟ سيتم حذف جميع السجلات المرتبطة بها.')) {
      return
    }

    try {
      await deleteBatch(batchId)
      // إعادة تحميل القائمة
      const updatedBatches = batches.filter(b => b.id !== batchId)
      dispatch({ type: 'SET_BATCHES', payload: updatedBatches })
      
      if (activeBatchId === batchId) {
        dispatch({ type: 'SET_ACTIVE_BATCH', payload: null })
      }
      
      alert('تم حذف الدفعة بنجاح')
    } catch (error) {
      console.error('Error deleting batch:', error)
      alert('حدث خطأ أثناء حذف الدفعة')
    }
  }

  function handleSetActiveBatch(batchId) {
    dispatch({ type: 'SET_ACTIVE_BATCH', payload: batchId })
  }

  return (
    <div className="card">
      <h3>الدفعات ({batches.length})</h3>
      
      {batches.length === 0 && (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
          لا توجد دفعات بعد. ابدأ بإضافة دفعة جديدة.
        </p>
      )}

      <ul className="batches-list">
        {batches.map(batch => (
          <li key={batch.id} className={activeBatchId === batch.id ? 'active' : ''}>
            <div>
              <strong>{batch.breed || 'غير محدد'}</strong>
              <div>العدد: {batch.chicks} كتكوت</div>
              <div>البدء: {formatDate(batch.start_date)}</div>
              {batch.chick_price > 0 && (
                <div>السعر: {batch.chick_price} ج</div>
              )}
            </div>
            <div className="buttons">
              <button 
                onClick={() => handleSetActiveBatch(batch.id)}
                className={activeBatchId === batch.id ? 'active' : ''}
              >
                {activeBatchId === batch.id ? 'نشطة' : 'تفعيل'}
              </button>
              <button 
                onClick={() => handleDeleteBatch(batch.id)}
                className="delete"
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h4>سجل الدفعة النشطة {records.length > 0 && `(${records.length} سجل)`}</h4>
      
      {loading ? (
        <p>جاري تحميل السجلات...</p>
      ) : records.length === 0 ? (
        <p>لا توجد سجلات لهذه الدفعة بعد.</p>
      ) : (
        <div className="records-table-container">
          <table>
            <thead>
              <tr>
                <th>اليوم</th>
                <th>العلف (كجم)</th>
                <th>الوزن (جم)</th>
                <th>النفوق</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(-20).reverse().map(record => (
                <tr key={record.rid}>
                  <td>{record.day}</td>
                  <td>{record.feed || '-'}</td>
                  <td>{record.avg_weight || '-'}</td>
                  <td>{record.mortality || '-'}</td>
                  <td>{formatDate(record.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .batches-list li.active {
          background: #f0f9ff;
          border-right: 3px solid #0ea5e9;
        }
        
        .buttons button.active {
          background: #0ea5e9;
          color: white;
        }
        
        .buttons button.delete {
          background: #ef4444;
          color: white;
        }
        
        .buttons button.delete:hover {
          background: #dc2626;
        }
        
        .records-table-container {
          overflow-x: auto;
          margin-top: 12px;
        }
        
        table {
          width: 100%;
          font-size: 13px;
        }
        
        th, td {
          white-space: nowrap;
          padding: 6px 8px;
        }
      `}</style>
    </div>
  )
        }
