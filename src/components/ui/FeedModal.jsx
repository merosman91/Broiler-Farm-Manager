import { useState } from "react"
import BaseModal from "./BaseModal"

export default function FeedModal({ open, onClose, onSave }) {
  const [amount, setAmount] = useState("")

  const handleSave = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("يرجى إدخال كمية علف صحيحة")
      return
    }
    onSave(parseFloat(amount))
    setAmount("")
    onClose()
  }

  return (
    <BaseModal open={open} onClose={onClose} title="تسجيل العلف">
      <input
        type="number"
        step="0.1"
        className="modal-input"
        placeholder="كمية العلف (كجم)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
      />
      
      <button
        onClick={handleSave}
        className="modal-save-btn feed"
      >
        حفظ العلف
      </button>
    </BaseModal>
  )
}

const feedModalStyles = `
.modal-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 16px;
}

.modal-input:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.modal-save-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modal-save-btn:hover {
  opacity: 0.9;
}

.modal-save-btn.feed {
  background: #10b981;
}
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = feedModalStyles
  document.head.appendChild(style)
        }
