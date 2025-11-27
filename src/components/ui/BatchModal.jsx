// src/components/ui/BatchModal.jsx
import { useState } from 'react';
import BaseModal from './BaseModal';

export default function BatchModal({ open, onClose, onSave }) {
  const [count, setCount] = useState('');
  const [breed, setBreed] = useState('');
  const [price, setPrice] = useState('');

  return (
    <BaseModal open={open} onClose={onClose} title="إضافة دفعة جديدة">
      <input className="w-full border p-2 rounded-xl mb-3" placeholder="عدد الكتاكيت" value={count} onChange={e=>setCount(e.target.value)} />
      <input className="w-full border p-2 rounded-xl mb-3" placeholder="السلالة" value={breed} onChange={e=>setBreed(e.target.value)} />
      <input className="w-full border p-2 rounded-xl mb-3" placeholder="سعر الكتكوت" value={price} onChange={e=>setPrice(e.target.value)} />

      <button
        onClick={() => { onSave({ count, breed, price }); onClose(); }}
        className="w-full py-2 bg-green-600 text-white rounded-xl"
      >حفظ الدفعة</button>
    </BaseModal>
  );
}
