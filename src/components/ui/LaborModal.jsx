import { useState } from "react"
import BaseModal from "./BaseModal"

export default function LaborModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    role: 'عامل',
    cost: '',
    period: 'شهري',
    date: new Date().toISOString().split('T')[0]
  })

  const roles = ['عامل', 'مشرف', 'مدير', 'سائق', 'أخرى']
  const periods = ['يومي', 'أسبوعي', 'شهري', 'مهمة']

  const handleSave = () => {
    if (!form.name || !form.cost || isNaN(form.cost) || parseFloat(form.cost) <= 0) {
      alert("يرجى إدخال بيانات صحيحة")
      return
    }
    onSave(form)
    setForm({
      name: '',
      role: 'عامل',
      cost: '',
      period: 'شهري',
      date: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <BaseModal open={open} onClose={onClose} title="إضافة عمالة">
      <input
        type="text"
        className="modal-input"
        placeholder="اسم العامل"
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value})}
      />
      
      <select 
        className="modal-input"
        value={form.role}
        onChange={(e) => setForm({...form, role: e.target.value})}
      >
        {roles.map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
      
      <input
        type="number"
        step="0.01"
        className="modal-input"
        placeholder="التكلفة (جنية)"
        value={form.cost}
        onChange={(e) => setForm({...form, cost: e.target.value})}
      />
      
      <select 
        className="modal-input"
        value={form.period}
        onChange={(e) => setForm({...form, period: e.target.value})}
      >
        {periods.map(period => (
          <option key={period} value={period}>{period}</option>
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
        className="modal-save-btn labor"
      >
        إضافة العامل
      </button>
    </BaseModal>
  )
        }
