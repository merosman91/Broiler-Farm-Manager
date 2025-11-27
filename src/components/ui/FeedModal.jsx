// src/components/ui/FeedModal.jsx
import { useState } from "react";
import BaseModal from "./BaseModal";

export default function FeedModal({ open, onClose, onSave }) {
  const [amount, setAmount] = useState("");

  return (
    <BaseModal open={open} onClose={onClose} title="تسجيل العلف">
      <input
        type="number"
        className="w-full border p-2 rounded-xl mb-3"
        placeholder="كمية العلف (كجم)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={() => {
          onSave(amount);
          onClose();
        }}
        className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
      >
        حفظ
      </button>
    </BaseModal>
  );
}
