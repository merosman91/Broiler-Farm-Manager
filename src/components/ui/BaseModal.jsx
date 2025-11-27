// src/components/ui/BaseModal.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function BaseModal({ open, onClose, children, title }) {
  if (!open) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
          {children}

          <button
            onClick={onClose}
            className="mt-4 w-full py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
          >
            إغلاق
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
