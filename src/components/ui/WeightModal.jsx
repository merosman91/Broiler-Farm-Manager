import { useState } from "react"
import BaseModal from "./BaseModal"

export default function WeightModal({ open, onClose, onSave }) {
  const [weight, setWeight] = useState("")

  const handleSave = () => {
    if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
      alert("يرجى إدخال وزن صحيح")
      return
    }
    onSave(parseFloat(weight))
    setWeight("")
    onClose()
  }

  return (
    <BaseModal open={open} onClose={onClose} title="تسجيل الوزن">
      <input
        type="number"
        step="1"
        className="modal-input"
        placeholder="متوسط الوزن (جرام)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
      />
      
      <button
        onClick={handleSave}
        className="modal-save-btn weight"
      >
        حفظ الوزن
      </button>
    </BaseModal>
  )
}

const weightModalStyles = `
.modal-save-btn.weight {
  background: #3b82f6;
}
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = weightModalStyles
  document.head.appendChild(style)
        }
