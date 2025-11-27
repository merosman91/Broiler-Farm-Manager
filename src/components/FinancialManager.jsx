import React, { useState, useEffect } from 'react'
import { getBatch, getExpenses, getIncomes, addExpense, addIncome, getRecords } from '../lib/db'
import { useFarm } from '../context/FarmContext'
import ExpenseModal from './ui/ExpenseModal'
import IncomeModal from './ui/IncomeModal'
import InventoryModal from './ui/InventoryModal'

const EXPENSE_CATEGORIES = {
  feed: 'علف وتغذية',
  medicine: 'أدوية ولقاحات',
  equipment: 'مستلزمات وصيانة',
  labor: 'عمالة ورواتب',
  transportation: 'نقل ووقود',
  utilities: 'كهرباء وماء',
  packaging: 'تعبئة وتغليف',
  other: 'مصاريف أخرى'
}

const INCOME_TYPES = {
  chicken_sale: 'بيع دواجن',
  egg_sale: 'بيع بيض',
  byproducts: 'منتجات ثانوية',
  other: 'إيرادات أخرى'
}

export default function FinancialManager({ activeBatchId }) {
  const { dispatch } = useFarm()
  const [batch, setBatch] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [records, setRecords] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [modals, setModals] = useState({
    expense: false,
    income: false,
    inventory: false
  })

  useEffect(() => {
    if (activeBatchId) {
      loadFinancialData()
    }
  }, [activeBatchId])

  async function loadFinancialData() {
    try {
      const [batchData, expensesData, incomesData, recordsData] = await Promise.all([
        getBatch(activeBatchId),
        getExpenses(activeBatchId),
        getIncomes(activeBatchId),
        getRecords(activeBatchId)
      ])
      setBatch(batchData)
      setExpenses(expensesData)
      setIncomes(incomesData)
      setRecords(recordsData)
    } catch (error) {
      console.error('Error loading financial data:', error)
    }
  }

  async function handleAddExpense(expenseData) {
    try {
      const newExpense = {
        batchId: activeBatchId,
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        subCategory: expenseData.subCategory,
        date: expenseData.date || new Date().toISOString().split('T')[0],
        quantity: expenseData.quantity ? parseFloat(expenseData.quantity) : null,
        unitPrice: expenseData.unitPrice ? parseFloat(expenseData.unitPrice) : null,
        type: expenseData.type || 'variable' // fixed, variable, indirect
      }

      await addExpense(newExpense)
      await loadFinancialData()
      setModals({...modals, expense: false})
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('حدث خطأ في إضافة المصروف')
    }
  }

  async function handleAddIncome(incomeData) {
    try {
      const newIncome = {
        batchId: activeBatchId,
        description: incomeData.description,
        amount: parseFloat(incomeData.amount),
        type: incomeData.type,
        date: incomeData.date || new Date().toISOString().split('T')[0],
        quantity: incomeData.quantity ? parseFloat(incomeData.quantity) : null,
        unitPrice: incomeData.unitPrice ? parseFloat(incomeData.unitPrice) : null,
        customer: incomeData.customer || ''
      }

      await addIncome(newIncome)
      await loadFinancialData()
      setModals({...modals, income: false})
    } catch (error) {
      console.error('Error adding income:', error)
      alert('حدث خطأ في إضافة الإيراد')
    }
  }

  function calculateFinancials() {
    if (!batch) return {}
    
    // إجمالي المصروفات
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    
    // المصروفات حسب النوع
    const fixedExpenses = expenses.filter(exp => exp.type === 'fixed')
                                 .reduce((sum, exp) => sum + (exp.amount || 0), 0)
    const variableExpenses = expenses.filter(exp => exp.type === 'variable')
                                   .reduce((sum, exp) => sum + (exp.amount || 0), 0)
    
    // المصروفات حسب الفئة
    const expensesByCategory = {}
    Object.values(EXPENSE_CATEGORIES).forEach(cat => {
      expensesByCategory[cat] = expenses.filter(exp => exp.category === cat)
                                       .reduce((sum, exp) => sum + (exp.amount || 0), 0)
    })

    // إجمالي الإيرادات
    const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0)
    
    // الإيرادات حسب النوع
    const incomeByType = {}
    Object.values(INCOME_TYPES).forEach(type => {
      incomeByType[type] = incomes.filter(inc => inc.type === type)
                                 .reduce((sum, inc) => sum + (inc.amount || 0), 0)
    })

    // تكلفة الكتاكيت
    const chicksCost = batch.chicks * (batch.chick_price || 0)
    
    // إجمالي التكاليف
    const totalCosts = chicksCost + totalExpenses
    
    // الربح/الخسارة
    const netProfit = totalIncome - totalCosts
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

    // تكلفة الوحدة
    const totalFeed = records.reduce((sum, r) => sum + (r.feed || 0), 0)
    const totalMortality = records.reduce((sum, r) => sum + (r.mortality || 0), 0)
    const currentChicks = Math.max(0, batch.chicks - totalMortality)
    
    const costPerChicken = currentChicks > 0 ? totalCosts / currentChicks : 0
    const feedCostPerKg = totalFeed > 0 ? expensesByCategory[EXPENSE_CATEGORIES.feed] / totalFeed : 0

    return {
      totalExpenses,
      fixedExpenses,
      variableExpenses,
      expensesByCategory,
      totalIncome,
      incomeByType,
      chicksCost,
      totalCosts,
      netProfit,
      profitMargin,
      costPerChicken,
      feedCostPerKg,
      currentChicks,
      totalFeed
    }
  }

  const financials = calculateFinancials()

  if (!activeBatchId) {
    return (
      <div className="card">
        <h4>الإدارة المالية</h4>
        <p>يرجى اختيار دفعة لعرض البيانات المالية</p>
      </div>
    )
  }

  return (
    <div className="card financial-manager">
      {/* النوافذ المنبثقة */}
      <ExpenseModal
        open={modals.expense}
        onClose={() => setModals({...modals, expense: false})}
        onSave={handleAddExpense}
      />

      <IncomeModal
        open={modals.income}
        onClose={() => setModals({...modals, income: false})}
        onSave={handleAddIncome}
      />

      <InventoryModal
        open={modals.inventory}
        onClose={() => setModals({...modals, inventory: false})}
      />

      <div className="financial-header">
        <h4>الإدارة المالية</h4>
        <div className="financial-actions">
          <button 
            onClick={() => setModals({...modals, expense: true})}
            className="btn-primary"
          >
            + مصروف
          </button>
          <button 
            onClick={() => setModals({...modals, income: true})}
            className="btn-success"
          >
            + إيراد
          </button>
          <button 
            onClick={() => setModals({...modals, inventory: true})}
            className="btn-info"
          >
            📦 مخزون
          </button>
        </div>
      </div>

      {/* علامات التبويب */}
      <div className="tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          نظرة عامة
        </button>
        <button 
          className={activeTab === 'expenses' ? 'active' : ''}
          onClick={() => setActiveTab('expenses')}
        >
          المصروفات
        </button>
        <button 
          className={activeTab === 'income' ? 'active' : ''}
          onClick={() => setActiveTab('income')}
        >
          الإيرادات
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          التقارير
        </button>
      </div>

      {/* محتوى علامات التبويب */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <FinancialOverview financials={financials} />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab expenses={expenses} financials={financials} />
        )}

        {activeTab === 'income' && (
          <IncomeTab incomes={incomes} financials={financials} />
        )}

        {activeTab === 'reports' && (
          <ReportsTab financials={financials} batch={batch} />
        )}
      </div>

      <style jsx>{`
        .financial-manager {
          min-height: 500px;
        }
        
        .financial-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .financial-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn-primary { background: #f59e0b; color: white; }
        .btn-success { background: #10b981; color: white; }
        .btn-info { background: #3b82f6; color: white; }
        
        .financial-actions button {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }
        
        .tabs button {
          padding: 8px 16px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        
        .tabs button.active {
          border-bottom-color: #f59e0b;
          color: #f59e0b;
          font-weight: 600;
        }
        
        .tab-content {
          min-height: 300px;
        }
        
        .financial-card {
          background: #f8fafc;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .financial-card h5 {
          margin: 0 0 8px 0;
          color: #374151;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .stat-item {
          background: white;
          padding: 12px;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
        }
        
        .stat-item.positive { border-left-color: #10b981; }
        .stat-item.negative { border-left-color: #ef4444; }
        
        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6b7280;
        }
        
        .expense-item, .income-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .category-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          background: #e5e7eb;
          color: #374151;
        }
      `}</style>
    </div>
  )
}

// المكونات المساعدة
function FinancialOverview({ financials }) {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{financials.totalIncome.toFixed(2)} ج</div>
          <div className="stat-label">إجمالي الإيرادات</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{financials.totalCosts.toFixed(2)} ج</div>
          <div className="stat-label">إجمالي التكاليف</div>
        </div>
        <div className={`stat-item ${financials.netProfit >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-value">{financials.netProfit.toFixed(2)} ج</div>
          <div className="stat-label">صافي الربح</div>
        </div>
        <div className={`stat-item ${financials.profitMargin >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-value">{financials.profitMargin.toFixed(1)}%</div>
          <div className="stat-label">هامش الربح</div>
        </div>
      </div>

      <div className="financial-card">
        <h5>تكاليف الوحدة</h5>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{financials.costPerChicken.toFixed(2)} ج</div>
            <div className="stat-label">تكلفة الدجاجة الواحدة</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{financials.feedCostPerKg.toFixed(2)} ج</div>
            <div className="stat-label">تكلفة الكيلو علف</div>
          </div>
        </div>
      </div>

      <div className="financial-card">
        <h5>توزيع المصروفات</h5>
        {Object.entries(financials.expensesByCategory).map(([category, amount]) => (
          amount > 0 && (
            <div key={category} className="expense-item">
              <span>{category}</span>
              <strong>{amount.toFixed(2)} ج</strong>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

function ExpensesTab({ expenses, financials }) {
  return (
    <div>
      <div className="financial-card">
        <h5>ملخص المصروفات</h5>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{financials.fixedExpenses.toFixed(2)} ج</div>
            <div className="stat-label">مصاريف ثابتة</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{financials.variableExpenses.toFixed(2)} ج</div>
            <div className="stat-label">مصاريف متغيرة</div>
          </div>
        </div>
      </div>

      <h5>آخر المصروفات</h5>
      {expenses.length === 0 ? (
        <p>لا توجد مصروفات مسجلة</p>
      ) : (
        expenses.slice(-10).reverse().map(expense => (
          <div key={expense.id} className="expense-item">
            <div>
              <div>{expense.description}</div>
              <span className="category-badge">{expense.category}</span>
            </div>
            <div style={{textAlign: 'left'}}>
              <strong>{expense.amount.toFixed(2)} ج</strong>
              <div style={{fontSize: '12px', color: '#6b7280'}}>
                {expense.date}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function IncomeTab({ incomes, financials }) {
  return (
    <div>
      <div className="financial-card">
        <h5>ملخص الإيرادات</h5>
        {Object.entries(financials.incomeByType).map(([type, amount]) => (
          amount > 0 && (
            <div key={type} className="income-item">
              <span>{type}</span>
              <strong>{amount.toFixed(2)} ج</strong>
            </div>
          )
        ))}
      </div>

      <h5>آخر الإيرادات</h5>
      {incomes.length === 0 ? (
        <p>لا توجد إيرادات مسجلة</p>
      ) : (
        incomes.slice(-10).reverse().map(income => (
          <div key={income.id} className="income-item">
            <div>
              <div>{income.description}</div>
              <span className="category-badge">{income.type}</span>
            </div>
            <div style={{textAlign: 'left'}}>
              <strong>{income.amount.toFixed(2)} ج</strong>
              <div style={{fontSize: '12px', color: '#6b7280'}}>
                {income.date}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function ReportsTab({ financials, batch }) {
  return (
    <div>
      <div className="financial-card">
        <h5>تقرير الربحية</h5>
        <div className="income-item">
          <span>إجمالي الإيرادات:</span>
          <strong>{financials.totalIncome.toFixed(2)} ج</strong>
        </div>
        <div className="income-item">
          <span>تكلفة الكتاكيت:</span>
          <strong>{financials.chicksCost.toFixed(2)} ج</strong>
        </div>
        <div className="income-item">
          <span>المصاريف التشغيلية:</span>
          <strong>{financials.totalExpenses.toFixed(2)} ج</strong>
        </div>
        <div className="income-item" style={{borderTop: '2px solid #e5e7eb', paddingTop: '8px'}}>
          <span>صافي الربح:</span>
          <strong style={{color: financials.netProfit >= 0 ? '#10b981' : '#ef4444'}}>
            {financials.netProfit.toFixed(2)} ج
          </strong>
        </div>
      </div>

      <div className="financial-card">
        <h5>مؤشرات الأداء</h5>
        <div className="income-item">
          <span>هامش الربح:</span>
          <strong style={{color: financials.profitMargin >= 0 ? '#10b981' : '#ef4444'}}>
            {financials.profitMargin.toFixed(1)}%
          </strong>
        </div>
        <div className="income-item">
          <span>تكلفة الدجاجة:</span>
          <strong>{financials.costPerChicken.toFixed(2)} ج</strong>
        </div>
        <div className="income-item">
          <span>كفاءة العلف:</span>
          <strong>{financials.feedCostPerKg.toFixed(2)} ج/كجم</strong>
        </div>
      </div>
    </div>
  )
  }
