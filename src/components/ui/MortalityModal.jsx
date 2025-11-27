// src/components/ui/MortalityModal.jsx
import { useState } from "react";
import BaseModal from "./BaseModal";

export default function MortalityModal({ open, onClose, onSave }) {
  const [count, setCount] = useState("");

  return (
    <BaseModal open={open} onClose={onClose} title="تسجيل النفوق">
      <input
        type="number"
        className="w-full border p-2 rounded-xl mb-3"
        placeholder="عدد النفوق"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />

      <button
        onClick={() => {
          onSave(count);
          onClose();
        }}
        className="w-full py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
      >
        حفظ
      </button>
    </BaseModal>
  );
}
