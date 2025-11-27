import React, { useState, useEffect } from 'react'
import { getBatch, updateBatch } from '../lib/db'
import { useFarm } from '../context/FarmContext'
import ExpenseModal from './ui/ExpenseModal'
import LaborModal from './ui/LaborModal'
import VeterinarianModal from './ui/VeterinarianModal'

export default function ExpensesManager({ activeBatchId }) {
  const { dispatch } = useFarm()
  const [batch, setBatch] = useState(null)
  const [modals, setModals] = useState({
    expense: false,
    labor: false,
    veterinarian: false
  })

  useEffect(() => {
    if (activeBatchId) {
      loadBatchData()
    }
  }, [activeBatchId])

  async function loadBatchData() {
    try {
      const batchData = await getBatch(activeBatchId)
      setBatch(batchData)
    } catch (error) {
      console.error('Error loading batch:', error)
    }
  }

  async function handleAddExpense(expenseData) {
    if (!batch) return

    try {
      const newExpense = {
        id: Date.now(),
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        date: expenseData.date || new Date().toISOString().split('T')[0],
        category: expenseData.category
      }

      const updatedBatch = {
        ...batch,
        expenses: [...(batch.expenses || []), newExpense]
      }

      await updateBatch(updatedBatch)
      setBatch(updatedBatch)
      dispatch({ type: 'UPDATE_BATCH', payload: updatedBatch })
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('حدث خطأ في إضافة المصروف')
    }
  }

  async function handleAddLabor(laborData) {
    if (!batch) return

    try {
      const newLabor = {
        id: Date.now(),
        name: laborData.name,
        role: laborData.role,
        cost: parseFloat(laborData.cost),
        period: laborData.period,
        date: laborData.date || new Date().toISOString().split('T')[0]
      }

      const updatedBatch = {
        ...batch,
        labor: [...(batch.labor || []), newLabor]
      }

      await updateBatch(updatedBatch)
      setBatch(updatedBatch)
      dispatch({ type: 'UPDATE_BATCH', payload: updatedBatch })
    } catch (error) {
      console.error('Error adding labor:', error)
      alert('حدث خطأ في إضافة العامل')
    }
  }

  async function handleAddVeterinarian(vetData) {
    if (!batch) return

    try {
      const newVet = {
        id: Date.now(),
        description: vetData.description,
        cost: parseFloat(vetData.cost),
        date: vetData.date || new Date().toISOString().split('T')[0],
        type: vetData.type
      }

      const updatedBatch = {
        ...batch,
        veterinarian: [...(batch.veterinarian || []), newVet]
      }

      await updateBatch(updatedBatch)
      setBatch(updatedBatch)
      dispatch({ type: 'UPDATE_BATCH', payload: updatedBatch })
    } catch (error) {
      console.error('Error adding vet expense:', error)
      alert('حدث خطأ في إضافة المصروف البيطري')
    }
  }

  function calculateTotals() {
    if (!batch) return {}
    
    const totalExpenses = (batch.expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0)
    const totalLabor = (batch.labor || []).reduce((sum, labor) => sum + (labor.cost || 0), 0)
    const totalVet = (batch.veterinarian || []).reduce((sum, vet) => sum + (vet.cost || 0), 0)
    const totalChicksCost = batch.chicks * (batch.chick_price || 0)
    const totalCosts = totalChicksCost + totalExpenses + totalLabor + totalVet

    return {
      totalExpenses,
      totalLabor,
      totalVet,
      totalChicksCost,
      totalCosts
    }
  }

  const totals = calculateTotals()

  if (!activeBatchId) {
    return (
      <div className="card">
        <h4>إدارة التكاليف</h4>
        <p>يرجى اختيار دفعة لعرض التكاليف</p>
      </div>
    )
  }

  return (
    <div className="card">
      <ExpenseModal
        open={modals.expense}
        onClose={() => setModals({...modals, expense: false})}
        onSave={handleAddExpense}
      />

      <LaborModal
        open={modals.labor}
        onClose={() => setModals({...modals, labor: false})}
        onSave={handleAddLabor}
      />

      <VeterinarianModal
        open={modals.veterinarian}
        onClose={() => setModals({...modals, veterinarian: false})}
        onSave={handleAddVeterinarian}
      />

      <h4>إدارة التكاليف والأرباح</h4>

      {/* أزرار الإضافة */}
      <div className="expense-buttons">
        <button 
          onClick={() => setModals({...modals, expense: true})}
          className="expense-btn"
        >
          💰 مصروفات
        </button>
        <button 
          onClick={() => setModals({...modals, labor: true})}
          className="labor-btn"
        >
          👥 عمالة
        </button>
        <button 
          onClick={() => setModals({...modals, veterinarian: true})}
          className="vet-btn"
        >
          🐾 بيطري
        </button>
      </div>

      {/* ملخص التكاليف */}
      {batch && (
        <div className="costs-summary">
          <h5>ملخص التكاليف</h5>
          <div className="cost-item">
            <span>تكلفة الكتاكيت:</span>
            <strong>{totals.totalChicksCost.toFixed(2)} ج</strong>
          </div>
          <div className="cost-item">
            <span>تكاليف العمالة:</span>
            <strong>{totals.totalLabor.toFixed(2)} ج</strong>
          </div>
          <div className="cost-item">
            <span>تكاليف بيطرية:</span>
            <strong>{totals.totalVet.toFixed(2)} ج</strong>
          </div>
          <div className="cost-item">
            <span>مصروفات أخرى:</span>
            <strong>{totals.totalExpenses.toFixed(2)} ج</strong>
          </div>
          <div className="cost-item total">
            <span>إجمالي التكاليف:</span>
            <strong>{totals.totalCosts.toFixed(2)} ج</strong>
          </div>
        </div>
      )}

      {/* قائمة المصروفات */}
      {batch && batch.expenses && batch.expenses.length > 0 && (
        <div className="expenses-list">
          <h5>آخر المصروفات</h5>
          {batch.expenses.slice(-5).reverse().map(expense => (
            <div key={expense.id} className="expense-item">
              <span>{expense.description}</span>
              <strong>{expense.amount.toFixed(2)} ج</strong>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .expense-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .expense-buttons button {
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .expense-btn { background: #f59e0b; color: white; }
        .labor-btn { background: #3b82f6; color: white; }
        .vet-btn { background: #10b981; color: white; }
        
        .expense-buttons button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        
        .costs-summary {
          background: #f8fafc;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .costs-summary h5 {
          margin: 0 0 8px 0;
          color: #374151;
        }
        
        .cost-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .cost-item.total {
          border-top: 2px solid #f59e0b;
          border-bottom: none;
          font-weight: bold;
          margin-top: 4px;
          padding-top: 8px;
        }
        
        .expenses-list {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
        }
        
        .expenses-list h5 {
          margin: 0 0 8px 0;
          color: #374151;
        }
        
        .expense-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #f3f4f6;
        }
      `}</style>
    </div>
  )
        }
