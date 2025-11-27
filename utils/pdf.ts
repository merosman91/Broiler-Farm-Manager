// utils/pdf.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateCyclePDF() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
  const element = document.getElementById('dashboard-report');
  if (!element) return;
  const canvas = await html2canvas(element);
  const img = canvas.toDataURL('image/png');
  const width = doc.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;
  doc.addImage(img, 'PNG', 0, 0, width, height);
  doc.save('cycle-report.pdf');
}
