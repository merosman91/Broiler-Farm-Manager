import { useState, useEffect } from "react"
import BaseModal from "./BaseModal"
import { getInventory, addInventory, updateInventory } from '../../lib/db'

const INVENTORY_TYPES = {
  feed: 'علف',
  medicine: 'أدوية',
  vaccine: 'لقاحات',
  equipment: 'مستلزمات',
  other: 'أخرى'
}

export default function InventoryModal({ open, onClose }) {
  const [inventory, setInventory] = useState([])
  const [form, setForm] = useState({
    name: '',
    type: 'feed',
    quantity: '',
    unit: 'كجم',
    minStock: '',
    expiryDate: '',
    unitPrice: '',
    notes: ''
  })

  useEffect(() => {
    if (open) {
      loadInventory()
    }
  }, [open])

  async function loadInventory() {
    try {
      const items = await getInventory()
      setInventory(items)
    } catch (error) {
      console.error('Error loading inventory:', error)
    }
  }

  async function handleAddItem() {
    if (!form.name || !form.quantity || isNaN(form.quantity)) {
      alert("يرجى إدخال بيانات صحيحة")
      return
    }

    try {
      const newItem = {
        name: form.name,
        type: form.type,
        quantity: parseFloat(form.quantity),
        unit: form.unit,
        minStock: form.minStock ? parseFloat(form.minStock) : 0,
        expiryDate: form.expiryDate || null,
        unitPrice: form.unitPrice ? parseFloat(form.unitPrice) : null,
        notes: form.notes,
        currentStock: parseFloat(form.quantity)
      }

      await addInventory(newItem)
      await loadInventory()
      setForm({
        name: '',
        type: 'feed',
        quantity: '',
        unit: 'كجم',
        minStock: '',
        expiryDate: '',
        unitPrice: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error adding inventory:', error)
      alert('حدث خطأ في إضافة العنصر')
    }
  }

  async function handleUpdateStock(itemId, newQuantity) {
    try {
      await updateInventory(itemId, { currentStock: newQuantity })
      await loadInventory()
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock)

  return (
    <BaseModal open={open} onClose={onClose} title="إدارة المخزون">
      {/* تنبيهات المخزون المنخفض */}
      {lowStockItems.length > 0 && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px'
        }}>
          <h5 style={{margin: '0 0 8px 0', color: '#dc2626'}}>تنبيهات المخزون</h5>
          {lowStockItems.map(item => (
            <div key={item.id} style={{fontSize: '14px', marginBottom: '4px'}}>
              ⚠️ {item.name} - المخزون: {item.currentStock} {item.unit}
            </div>
          ))}
        </div>
      )}

      {/* نموذج إضافة عنصر جديد */}
      <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '16px'}}>
        <h5 style={{margin: '0 0 12px 0'}}>إضافة عنصر جديد</h5>
        
        <input
          type="text"
          className="modal-input"
          placeholder="اسم العنصر"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
        />
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
          <select 
            className="modal-input"
            value={form.type}
            onChange={(e) => setForm({...form, type: e.target.value})}
          >
            {Object.entries(INVENTORY_TYPES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <select 
            className="modal-input"
            value={form.unit}
            onChange={(e) => setForm({...form, unit: e.target.value})}
          >
            <option value="كجم">كجم</option>
            <option value="جرام">جرام</option>
            <option value="لتر">لتر</option>
            <option value="علبة">علبة</option>
            <option value="كيس">كيس</option>
            <option value="وحدة">وحدة</option>
          </select>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
          <input
            type="number"
            step="0.01"
            className="modal-input"
            placeholder="الكمية"
            value={form.quantity}
            onChange={(e) => setForm({...form, quantity: e.target.value})}
          />
          
          <input
            type="number"
            step="0.01"
            className="modal-input"
            placeholder="الحد الأدنى"
            value={form.minStock}
            onChange={(e) => setForm({...form, minStock: e.target.value})}
          />
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
          <input
            type="date"
            className="modal-input"
            placeholder="تاريخ الانتهاء"
            value={form.expiryDate}
            onChange={(e) => setForm({...form, expiryDate: e.target.value})}
          />
          
          <input
            type="number"
            step="0.01"
            className="modal-input"
            placeholder="سعر الوحدة"
            value={form.unitPrice}
            onChange={(e) => setForm({...form, unitPrice: e.target.value})}
          />
        </div>

        <button
          onClick={handleAddItem}
          className="modal-save-btn"
          style={{background: '#10b981'}}
        >
          إضافة إلى المخزون
        </button>
      </div>

      {/* قائمة المخزون الحالي */}
      <h5 style={{margin: '0 0 12px 0'}}>المخزون الحالي</h5>
      {inventory.length === 0 ? (
        <p>لا توجد عناصر في المخزون</p>
      ) : (
        <div style={{maxHeight: '200px', overflowY: 'auto'}}>
          {inventory.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              marginBottom: '8px',
              background: item.currentStock <= item.minStock ? '#fef2f2' : 'white'
            }}>
              <div>
                <div style={{fontWeight: '500'}}>{item.name}</div>
                <div style={{fontSize: '12px', color: '#6b7280'}}>
                  {item.type} • {item.currentStock} {item.unit}
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <input
                  type="number"
                  style={{
                    width: '60px',
                    padding: '4px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                  value={item.currentStock}
                  onChange={(e) => handleUpdateStock(item.id, parseFloat(e.target.value))}
                />
                <span style={{fontSize: '12px'}}>{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseModal>
  )
    }
