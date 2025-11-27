import { useState } from "react"
import BaseModal from "./BaseModal"

export default function VeterinarianModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    description: '',
    cost: '',
    type: 'كشف',
    date: new Date().toISOString().split('T')[0]
  })

  const types = ['كشف', 'علاج', 'تحصين', 'أدوية', 'عمليات', 'أخرى']

  const handleSave = () => {
    if (!form.description || !form.cost || isNaN(form.cost) || parseFloat(form.cost) <= 0) {
      alert("يرجى إدخال بيانات صحيحة")
      return
    }
    onSave(form)
    setForm({
      description: '',
      cost: '',
      type: 'كشف',
      date: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <BaseModal open={open} onClose={onClose} title="إضافة مصروف بيطري">
      <input
        type="text"
        className="modal-input"
        placeholder="وصف الخدمة البيطرية"
        value={form.description}
        onChange={(e) => setForm({...form, description: e.target.value})}
      />
      
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
        value={form.type}
        onChange={(e) => setForm({...form, type: e.target.value})}
      >
        {types.map(type => (
          <option key={type} value={type}>{type}</option>
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
        className="modal-save-btn vet"
      >
        إضافة المصروف
      </button>
    </BaseModal>
  )
    }
