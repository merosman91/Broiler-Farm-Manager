// src/components/ui/Toast.jsx
import { AnimatePresence, motion } from 'framer-motion';

export default function Toast({ message, type }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className={`fixed top-4 right-4 px-4 py-2 rounded-xl shadow text-white z-50
            ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
