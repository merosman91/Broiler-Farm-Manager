import { AnimatePresence, motion } from 'framer-motion'

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null

  // إغلاق تلقائي بعد 3 ثواني
  setTimeout(() => {
    if (onClose) onClose()
  }, 3000)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={`toast ${type}`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  )
}

const toastStyles = `
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
}

.toast.success {
  background: #10b981;
}

.toast.error {
  background: #ef4444;
}

.toast.info {
  background: #3b82f6;
}
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = toastStyles
  document.head.appendChild(style)
  }
