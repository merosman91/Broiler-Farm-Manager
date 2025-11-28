import { useState } from "react"
import BaseModal from "./BaseModal"

const INCOME_TYPES = {
  chicken_sale: 'بيع دواجن',
  egg_sale: 'بيع بيض', 
  byproducts: 'منتجات ثانوية',
  other: 'إيرادات أخرى'
}

export default function IncomeModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'chicken_sale',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    unitPrice: '',
    customer: '',
    notes: ''
  })

  const handleSave = () => {
    if (!form.description || !form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      alert("يرجى إدخال بيانات صحيحة")
      return
    }

    const incomeData = {
      ...form,
      amount: parseFloat(form.amount),
      quantity: form.quantity ? parseFloat(form.quantity) : null,
      unitPrice: form.unitPrice ? parseFloat(form.unitPrice) : null,
      type: INCOME_TYPES[form.type]
    }

    onSave(incomeData)
    setForm({
      description: '',
      amount: '',
      type: 'chicken_sale',
      date: new Date().toISOString().split('T')[0],
      quantity: '',
      unitPrice: '',
      customer: '',
      notes: ''
    })
  }

  return (
    <BaseModal open={open} onClose={onClose} title="إضافة إيراد جديد">
      <input
        type="text"
        className="modal-input"
        placeholder="وصف الإيراد"
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
          {Object.entries(INCOME_TYPES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

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
        type="text"
        className="modal-input"
        placeholder="اسم العميل (اختياري)"
        value={form.customer}
        onChange={(e) => setForm({...form, customer: e.target.value})}
      />

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
        className="modal-save-btn income"
      >
        إضافة الإيراد
      </button>
    </BaseModal>
  )
        }
