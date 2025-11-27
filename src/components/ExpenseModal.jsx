import { useState } from "react"
import BaseModal from "./BaseModal"

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

const EXPENSE_TYPES = {
  fixed: 'ثابتة',
  variable: 'متغيرة',
  indirect: 'غير مباشرة'
}

export default function ExpenseModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'feed',
    type: 'variable',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    unitPrice: '',
    notes: ''
  })

  const handleSave = () => {
    if (!form.description || !form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      alert("يرجى إدخال بيانات صحيحة")
      return
    }

    const expenseData = {
      ...form,
      amount: parseFloat(form.amount),
      quantity: form.quantity ? parseFloat(form.quantity) : null,
      unitPrice: form.unitPrice ? parseFloat(form.unitPrice) : null,
      category: EXPENSE_CATEGORIES[form.category]
    }

    onSave(expenseData)
    setForm({
      description: '',
      amount: '',
      category: 'feed',
      type: 'variable',
      date: new Date().toISOString().split('T')[0],
      quantity: '',
      unitPrice: '',
      notes: ''
    })
  }

  return (
    <BaseModal open={open} onClose={onClose} title="إضافة مصروف جديد">
      <input
        type="text"
        className="modal-input"
        placeholder="وصف المصروف"
        value={form.description}
        onChange={(e) => setForm({...form, description: e.target.value})}
      />
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
        <input
          type="number"
          step="0.01"
          className="modal-input"
          placeholder="المبلغ (جنية)"
          value={form.amount}
          onChange={(e) => setForm({...form, amount: e.target.value})}
        />
        
        <select 
          className="modal-input"
          value={form.type}
          onChange={(e) => setForm({...form, type: e.target.value})}
        >
          {Object.entries(EXPENSE_TYPES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <select 
        className="modal-input"
        value={form.category}
        onChange={(e) => setForm({...form, category: e.target.value})}
      >
        {Object.entries(EXPENSE_CATEGORIES).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
        <input
          type="number"
          step="0.01"
          className="modal-input"
          placeholder="الكمية"
          value={form.quantity}
          onChange={(e) => setForm({...form, quantity: e.target.value})}
        />
        
        <input
          type="number"
          step="0.01"
          className="modal-input"
          placeholder="سعر الوحدة"
          value={form.unitPrice}
          onChange={(e) => setForm({...form, unitPrice: e.target.value})}
        />
      </div>

      <input
        type="date"
        className="modal-input"
        value={form.date}
        onChange={(e) => setForm({...form, date: e.target.value})}
      />
      
      <textarea
        className="modal-input"
        placeholder="ملاحظات (اختياري)"
        rows="3"
        value={form.notes}
        onChange={(e) => setForm({...form, notes: e.target.value})}
      />
      
      <button
        onClick={handleSave}
        className="modal-save-btn expense"
      >
        إضافة المصروف
      </button>
    </BaseModal>
  )
    }
