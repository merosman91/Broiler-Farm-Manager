import React from 'react'
import { getBatch, getRecords } from '../lib/db'
import { calcCycleDay } from '../lib/dateUtils'

export default function ShareButtons({ activeBatchId }) {
  const shareOnWhatsApp = async () => {
    if (!activeBatchId) {
      alert('يرجى اختيار دفعة أولاً')
      return
    }

    try {
      const [batch, records] = await Promise.all([
        getBatch(activeBatchId),
        getRecords(activeBatchId)
      ])

      if (!batch) return

      const cycleDay = calcCycleDay(batch.start_date)
      const totalMortality = records.reduce((sum, r) => sum + (r.mortality || 0), 0)
      const totalFeed = records.reduce((sum, r) => sum + (r.feed || 0), 0)
      const currentChicks = Math.max(0, batch.chicks - totalMortality)
      
      // الحسابات المالية
      const totalExpenses = (batch.expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0)
      const totalLabor = (batch.labor || []).reduce((sum, labor) => sum + (labor.cost || 0), 0)
      const totalVet = (batch.veterinarian || []).reduce((sum, vet) => sum + (vet.cost || 0), 0)
      const totalChicksCost = batch.chicks * (batch.chick_price || 0)
      const totalCosts = totalChicksCost + totalExpenses + totalLabor + totalVet

      const message = `
✅ *تقرير مزرعة شمسين*

🐔 *الدفعة:* ${batch.breed || 'غير محدد'}
📅 *العمر:* ${cycleDay} يوم
🐣 *الكتاكيت:* ${currentChicks} / ${batch.chicks}
💀 *النفوق:* ${totalMortality}
🌾 *العلف:* ${totalFeed.toFixed(1)} كجم

💰 *التكاليف:*
• الكتاكيت: ${totalChicksCost.toFixed(2)} ج
• العمالة: ${totalLabor.toFixed(2)} ج  
• بيطري: ${totalVet.toFixed(2)} ج
• مصروفات: ${totalExpenses.toFixed(2)} ج
• *الإجمالي:* ${totalCosts.toFixed(2)} ج

${window.location.href}
      `.trim()

      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
      
      window.open(whatsappUrl, '_blank')
    } catch (error) {
      console.error('Error sharing:', error)
      alert('حدث خطأ في المشاركة')
    }
  }

  const shareOnTelegram = async () => {
    if (!activeBatchId) {
      alert('يرجى اختيار دفعة أولاً')
      return
    }

    try {
      const [batch, records] = await Promise.all([
        getBatch(activeBatchId),
        getRecords(activeBatchId)
      ])

      if (!batch) return

      const cycleDay = calcCycleDay(batch.start_date)
      const totalMortality = records.reduce((sum, r) => sum + (r.mortality || 0), 0)
      const totalFeed = records.reduce((sum, r) => sum + (r.feed || 0), 0)
      const currentChicks = Math.max(0, batch.chicks - totalMortality)

      const message = `
✅ تقرير مزرعة شمسين

🐔 الدفعة: ${batch.breed || 'غير محدد'}
📅 العمر: ${cycleDay} يوم  
🐣 الكتاكيت: ${currentChicks} / ${batch.chicks}
💀 النفوق: ${totalMortality}
🌾 العلف: ${totalFeed.toFixed(1)} كجم

${window.location.href}
      `.trim()

      const encodedMessage = encodeURIComponent(message)
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodedMessage}`
      
      window.open(telegramUrl, '_blank')
    } catch (error) {
      console.error('Error sharing:', error)
      alert('حدث خطأ في المشاركة')
    }
  }

  return (
    <div className="card">
      <h4>مشاركة التقرير</h4>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
        مشاركة ملخص الدفعة عبر التطبيقات
      </p>
      <div className="share-buttons">
        <button 
          onClick={shareOnWhatsApp}
          className="share-btn whatsapp"
        >
          📱 واتساب
        </button>
        <button 
          onClick={shareOnTelegram}
          className="share-btn telegram"
        >
          ✈️ تليجرام
        </button>
      </div>
    </div>
  )
                                                                               }
