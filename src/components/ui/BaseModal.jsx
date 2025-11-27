import { motion, AnimatePresence } from "framer-motion"

export default function BaseModal({ open, onClose, children, title }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">{title}</h2>
            {children}
            <button
              onClick={onClose}
              className="modal-close-btn"
            >
              إغلاق
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// إضافة CSS للمودال
const modalStyles = `
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1f2937;
  text-align: center;
}

.modal-close-btn {
  width: 100%;
  padding: 12px;
  background: #f3f4f6;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 16px;
}

.modal-close-btn:hover {
  background: #e5e7eb;
}
`

// إضافة الستايل للhead
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = modalStyles
  document.head.appendChild(style)
            }
