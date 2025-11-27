>>> filename: src/components/ExportPDF.jsx
import React from 'react'
import { getBatch, getRecords } from '../lib/db'
import jsPDF from 'jspdf'

export default function ExportPDF({activeBatchId}){
  async function make(){
    if(!activeBatchId) return alert('اختر دفعة أولاً')
    const batch = await getBatch(activeBatchId)
    const records = await getRecords(activeBatchId)
    const doc = new jsPDF({orientation:'portrait', unit:'mm', format:'a4'})
    doc.setFontSize(16)
    doc.text('تقرير نهاية الدورة - شمسين', 105, 20, {align:'center'})
    doc.setFontSize(12)
    doc.text(`الدفعة: ${batch.breed || '-'}  |  عدد الكتاكيت: ${batch.chicks}`, 14, 36)
    doc.text(`تاريخ البدء: ${batch.start_date}`, 14, 44)

    doc.setFontSize(11)
    doc.text('سجل القياسات:', 14, 56)
    let y = 64
    records.slice(-40).forEach(r=>{
      if(y>270){ doc.addPage(); y=20 }
      doc.text(`يوم ${r.day} — علف: ${r.feed || '-'} كجم — وفيات: ${r.mortality || 0} — متوسط وزن: ${r.avg_weight || '-'} جم`, 14, y)
      y += 7
    })

    doc.save(`report-${batch.id}.pdf`)
  }

  return (<div className="card"><h4>تصدير التقرير</h4><button onClick={make}>تصدير PDF</button></div>)
}
