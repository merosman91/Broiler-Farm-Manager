import React from 'react'
import { getBatch, getRecords } from '../lib/db'
import jsPDF from 'jspdf'
import { formatDate, calcCycleDay } from '../lib/dateUtils'

export default function ExportPDF({ activeBatchId }) {
  async function generatePDF() {
    if (!activeBatchId) {
      alert('يرجى اختيار دفعة أولاً')
      return
    }

    try {
      const [batch, records] = await Promise.all([
        getBatch(activeBatchId),
        getRecords(activeBatchId)
      ])

      if (!batch) {
        alert('لم يتم العثور على بيانات الدفعة')
        return
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // إعداد الخطوط والنص العربي
      doc.setFont('Helvetica')
      doc.setFontSize(20)
      doc.setTextColor(245, 158, 11) // لون برتقالي
      doc.text('تقرير نهاية الدورة - شمسين', 105, 20, { align: 'center' })
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0) // لون أسود
      
      // معلومات الدفعة
      const cycleDay = calcCycleDay(batch.start_date)
      doc.text(`الدفعة: ${batch.breed || 'غير محدد'}`, 14, 40)
      doc.text(`عدد الكتاكيت: ${batch.chicks}`, 14, 48)
      doc.text(`تاريخ البدء: ${formatDate(batch.start_date)}`, 14, 56)
      doc.text(`عمر الدورة: ${cycleDay} يوم`, 14, 64)
      
      if (batch.chick_price > 0) {
        doc.text(`سعر الكتكوت: ${batch.chick_price} جنية`, 14, 72)
      }

      // إحصائيات
      const totalMortality = records.reduce((sum, r) => sum + (r.mortality || 0), 0)
      const totalFeed = records.reduce((sum, r) => sum + (r.feed || 0), 0)
      const currentChicks = Math.max(0, batch.chicks - totalMortality)
      const mortalityRate = ((totalMortality / batch.chicks) * 100).toFixed(1)
      
      doc.text(`الكتاكيت الحالية: ${currentChicks}`, 14, 85)
      doc.text(`إجمالي النفوق: ${totalMortality} (${mortalityRate}%)`, 14, 93)
      doc.text(`إجمالي العلف: ${totalFeed.toFixed(1)} كجم`, 14, 101)

      // آخر وزن مسجل
      const lastWeightRecord = records
        .filter(r => r.avg_weight && r.avg_weight > 0)
        .sort((a, b) => b.day - a.day)[0]
      
      if (lastWeightRecord) {
        doc.text(`آخر وزن مسجل: ${lastWeightRecord.avg_weight} جم (يوم ${lastWeightRecord.day})`, 14, 109)
      }

      // سجل القياسات
      doc.setFontSize(14)
      doc.text('سجل القياسات:', 14, 125)
      
      doc.setFontSize(10)
      let yPosition = 135
      const pageHeight = doc.internal.pageSize.height
      
      // عرض آخر 30 سجل
      const recentRecords = records.slice(-30).reverse()
      
      recentRecords.forEach(record => {
        // التحقق من المساحة قبل إضافة نص
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        
        const recordText = [
          `يوم ${record.day}`,
          record.feed ? `علف: ${record.feed}كجم` : null,
          record.avg_weight ? `وزن: ${record.avg_weight}جم` : null,
          record.mortality ? `نفوق: ${record.mortality}` : null
        ].filter(Boolean).join(' - ')
        
        doc.text(recordText, 14, yPosition)
        yPosition += 6
      })

      // تذييل الصفحة
      const totalPages = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(
          `صفحة ${i} من ${totalPages} - تم الإنشاء في ${new Date().toLocaleDateString('ar-EG')}`,
          105,
          pageHeight - 10,
          { align: 'center' }
        )
      }

      // حفظ الملف
      doc.save(`تقرير-شمسين-${batch.breed || 'دفعة'}-${batch.id}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('حدث خطأ أثناء إنشاء التقرير')
    }
  }

  return (
    <div className="card">
      <h4>تصدير التقارير</h4>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
        تصدير تقرير كامل عن الدفعة الحالية بصيغة PDF
      </p>
      <button 
        onClick={generatePDF}
        style={{
          width: '100%',
          padding: '12px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.target.style.background = '#dc2626'}
        onMouseOut={(e) => e.target.style.background = '#ef4444'}
      >
        تصدير تقرير PDF
      </button>
    </div>
  )
        }
