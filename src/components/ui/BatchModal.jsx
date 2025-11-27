import { useState } from "react"
import BaseModal from "./BaseModal"

export default function BatchModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    start_date: new Date().toISOString().split('T')[0],
    chicks: "",
    breed: "",
    chick_price: "",
    start_weight: ""
  })

  const handleSave = () => {
    if (!form.start_date || !form.chicks || parseInt(form.chicks) <= 0) {
      alert("يرجى إدخال تاريخ البدء وعدد الكتاكيت بشكل صحيح")
      return
    }
    
    const batchData = {
      ...form,
      chicks: parseInt(form.chicks),
      chick_price: parseFloat(form.chick_price) || 0,
      start_weight: parseFloat(form.start_weight) || 0
    }
    
    onSave(batchData)
    setForm({
      start_date: new Date().toISOString().split('T')[0],
      chicks: "",
      breed: "",
      chick_price: "",
      start_weight: ""
    })
    onClose()
  }

  return (
    <BaseModal open={open} onClose={onClose} title="إضافة دفعة جديدة">
      <input
        type="date"
        className="modal-input"
        value={form.start_date}
        onChange={(e) => setForm({...form, start_date: e.target.value})}
      />
      
      <input
        type="number"
        className="modal-input"
        placeholder="عدد الكتاكيت"
        value={form.chicks}
        onChange={(e) => setForm({...form, chicks: e.target.value})}
      />
      
      <input
        type="text"
        className="modal-input"
        placeholder="السلالة"
        value={form.breed}
        onChange={(e) => setForm({...form, breed: e.target.value})}
      />
      
      <input
        type="number"
        step="0.01"
        className="modal-input"
        placeholder="سعر الكتكوت"
        value={form.chick_price}
        onChange={(e) => setForm({...form, chick_price: e.target.value})}
      />
      
      <input
        type="number"
        className="modal-input"
        placeholder="الوزن الابتدائي (جرام)"
        value={form.start_weight}
        onChange={(e) => setForm({...form, start_weight: e.target.value})}
      />
      
      <button
        onClick={handleSave}
        className="modal-save-btn batch"
      >
        حفظ الدفعة
      </button>
    </BaseModal>
  )
}

const batchModalStyles = `
.modal-save-btn.batch {
  background: #f59e0b;
}
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = batchModalStyles
  document.head.appendChild(style)
      }
