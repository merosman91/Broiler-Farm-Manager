import React from 'react'
import { getBatch, getRecords } from '../lib/db'
import jsPDF from 'jspdf'
import { formatDate, calcCycleDay } from '../lib/dateUtils'

// دعم النصوص العربية
const arabicText = {
  title: 'تقرير نهاية الدورة - شمسين',
  batch: 'الدفعة',
  chicks: 'عدد الكتاكيت',
  startDate: 'تاريخ البدء',
  cycleAge: 'عمر الدورة',
  chickPrice: 'سعر الكتكوت',
  currentChicks: 'الكتاكيت الحالية',
  totalMortality: 'إجمالي النفوق',
  totalFeed: 'إجمالي العلف',
  lastWeight: 'آخر وزن مسجل',
  records: 'سجل القياسات',
  day: 'يوم',
  feed: 'علف',
  weight: 'وزن',
  mortality: 'نفوق',
  page: 'صفحة',
  of: 'من',
  generated: 'تم الإنشاء في'
}

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

      // استخدام خط يدعم العربية
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // إضافة دعم للغة العربية
      doc.setLanguage('ar')

      // معلومات الدفعة
      const cycleDay = calcCycleDay(batch.start_date)
      const totalMortality = records.reduce((sum, r) => sum + (r.mortality || 0), 0)
      const totalFeed = records.reduce((sum, r) => sum + (r.feed || 0), 0)
      const currentChicks = Math.max(0, batch.chicks - totalMortality)
      const mortalityRate = ((totalMortality / batch.chicks) * 100).toFixed(1)
      
      // الحسابات المالية
      const totalExpenses = (batch.expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0)
      const totalLabor = (batch.labor || []).reduce((sum, labor) => sum + (labor.cost || 0), 0)
      const totalVet = (batch.veterinarian || []).reduce((sum, vet) => sum + (vet.cost || 0), 0)
      const totalChicksCost = batch.chicks * (batch.chick_price || 0)
      const totalCosts = totalChicksCost + totalExpenses + totalLabor + totalVet

      // العنوان
      doc.setFontSize(20)
      doc.setTextColor(245, 158, 11)
      doc.text(arabicText.title, 105, 20, { align: 'center' })
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      
      // معلومات الدفعة
      let yPosition = 40
      doc.text(`${arabicText.batch}: ${batch.breed || 'غير محدد'}`, 14, yPosition)
      yPosition += 8
      doc.text(`${arabicText.chicks}: ${batch.chicks}`, 14, yPosition)
      yPosition += 8
      doc.text(`${arabicText.startDate}: ${formatDate(batch.start_date)}`, 14, yPosition)
      yPosition += 8
      doc.text(`${arabicText.cycleAge}: ${cycleDay} يوم`, 14, yPosition)
      yPosition += 8
      
      if (batch.chick_price > 0) {
        doc.text(`${arabicText.chickPrice}: ${batch.chick_price} جنية`, 14, yPosition)
        yPosition += 8
      }

      // إحصائيات
      yPosition += 8
      doc.text(`${arabicText.currentChicks}: ${currentChicks}`, 14, yPosition)
      yPosition += 8
      doc.text(`${arabicText.totalMortality}: ${totalMortality} (${mortalityRate}%)`, 14, yPosition)
      yPosition += 8
      doc.text(`${arabicText.totalFeed}: ${totalFeed.toFixed(1)} كجم`, 14, yPosition)
      yPosition += 8

      // آخر وزن مسجل
      const lastWeightRecord = records
        .filter(r => r.avg_weight && r.avg_weight > 0)
        .sort((a, b) => b.day - a.day)[0]
      
      if (lastWeightRecord) {
        doc.text(`${arabicText.lastWeight}: ${lastWeightRecord.avg_weight} جم (${arabicText.day} ${lastWeightRecord.day})`, 14, yPosition)
        yPosition += 8
      }

      // التكاليف والأرباح
      yPosition += 8
      doc.setFontSize(14)
      doc.text('التكاليف والأرباح:', 14, yPosition)
      yPosition += 10
      doc.setFontSize(10)
      
      doc.text(`تكلفة الكتاكيت: ${totalChicksCost.toFixed(2)} جنية`, 14, yPosition)
      yPosition += 6
      doc.text(`تكاليف العمالة: ${totalLabor.toFixed(2)} جنية`, 14, yPosition)
      yPosition += 6
      doc.text(`تكاليف بيطرية: ${totalVet.toFixed(2)} جنية`, 14, yPosition)
      yPosition += 6
      doc.text(`مصروفات أخرى: ${totalExpenses.toFixed(2)} جنية`, 14, yPosition)
      yPosition += 6
      doc.text(`إجمالي التكاليف: ${totalCosts.toFixed(2)} جنية`, 14, yPosition)
      yPosition += 8

      // سجل القياسات
      doc.setFontSize(14)
      doc.text(`${arabicText.records}:`, 14, yPosition)
      yPosition += 10
      
      doc.setFontSize(8)
      const pageHeight = doc.internal.pageSize.height
      
      // عرض آخر 20 سجل
      const recentRecords = records.slice(-20).reverse()
      
      recentRecords.forEach(record => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        
        const recordText = [
          `${arabicText.day} ${record.day}`,
          record.feed ? `${arabicText.feed}: ${record.feed}كجم` : null,
          record.avg_weight ? `${arabicText.weight}: ${record.avg_weight}جم` : null,
          record.mortality ? `${arabicText.mortality}: ${record.mortality}` : null
        ].filter(Boolean).join(' - ')
        
        doc.text(recordText, 14, yPosition)
        yPosition += 5
      })

      // تذييل الصفحة
      const totalPages = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(
          `${arabicText.page} ${i} ${arabicText.of} ${totalPages} - ${arabicText.generated} ${new Date().toLocaleDateString('ar-EG')}`,
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
        className="export-btn"
      >
        📄 تصدير تقرير PDF
      </button>
    </div>
  )
  }
