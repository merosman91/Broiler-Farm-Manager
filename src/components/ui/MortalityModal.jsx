import { useState } from "react"
import BaseModal from "./BaseModal"

export default function MortalityModal({ open, onClose, onSave }) {
  const [count, setCount] = useState("")

  const handleSave = () => {
    if (!count || isNaN(count) || parseInt(count) < 0) {
      alert("يرجى إدخال عدد صحيح")
      return
    }
    onSave(parseInt(count))
    setCount("")
    onClose()
  }

  return (
    <BaseModal open={open} onClose={onClose} title="تسجيل النفوق">
      <input
        type="number"
        className="modal-input"
        placeholder="عدد النفوق"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
      />
      
      <button
        onClick={handleSave}
        className="modal-save-btn mortality"
      >
        حفظ النفوق
      </button>
    </BaseModal>
  )
}

const mortalityModalStyles = `
.modal-save-btn.mortality {
  background: #ef4444;
}
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = mortalityModalStyles
  document.head.appendChild(style)
        }
