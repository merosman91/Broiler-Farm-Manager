import { useState } from "react"
import BaseModal from "./BaseModal"

export default function ExpenseModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'علف',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = ['علف', 'أدوية', 'كهرباء', 'ماء', 'نقل', 'أخرى']

  const handleSave = () => {
    if (!form.description || !form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      alert("يرجى إدخال بيانات صحيحة")
      return
    }
    onSave(form)
    setForm({
      description: '',
      amount: '',
      category: 'علف',
      date: new Date().toISOString().split('T')[0]
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
        value={form.category}
        onChange={(e) => setForm({...form, category: e.target.value})}
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <input
        type="date"
        className="modal-input"
        value={form.date}
        onChange={(e) => setForm({...form, date: e.target.value})}
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
