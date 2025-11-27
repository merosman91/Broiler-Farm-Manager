// src/pages/FinalReport.jsx
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function FinalReport({ batch, feed, weights, mortality }) {
  const exportPDF = async () => {
    const element = document.getElementById('report');
    const canvas = await html2canvas(element);
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, width, height);
    pdf.save('final-report.pdf');
  };

  return (
    <div className="p-4">
      <div id="report" className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">التقرير النهائي للدورة</h2>

        <p><strong>عدد الكتاكيت:</strong> {batch?.count}</p>
        <p><strong>السلالة:</strong> {batch?.breed}</p>
        <p><strong>سعر الكتكوت:</strong> {batch?.price}</p>

        <hr className="my-4" />
        <h3 className="text-lg font-semibold">إجمالي الاستهلاك</h3>
        <p>العلف: {feed.reduce((t,f)=>t+Number(f.amount),0)} كجم</p>
        <p>مجموع النفوق: {mortality.reduce((t,m)=>t+Number(m.count),0)}</p>

        <h3 className="text-lg font-semibold mt-4">متوسط الوزن</h3>
        <p>{weights.length ? weights[weights.length-1].weight + ' جرام' : '—'}</p>
      </div>

      <button
        onClick={exportPDF}
        className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl"
      >
        تحميل PDF
      </button>
    </div>
  );
}
