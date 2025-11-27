// src/components/ui/WeightModal.jsx
import { useState } from "react";
import BaseModal from "./BaseModal";

export default function WeightModal({ open, onClose, onSave }) {
  const [weight, setWeight] = useState("");

  return (
    <BaseModal open={open} onClose={onClose} title="تسجيل الوزن">
      <input
        type="number"
        className="w-full border p-2 rounded-xl mb-3"
        placeholder="متوسط الوزن (جرام)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button
        onClick={() => {
          onSave(weight);
          onClose();
        }}
        className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        حفظ
      </button>
    </BaseModal>
  );
}
