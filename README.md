
# شمسين — Broiler Farm Manager (React + PWA) — نسخة مطورة

هذه النسخة تضيف:
- تخزين محلي باستخدام IndexedDB عبر مكتبة `idb`.
- تصدير تقرير PDF باستخدام `jsPDF`.
- رسم بياني تفاعلي للوزن باستخدام `recharts`.
- تكامل PWA باستخدام `vite-plugin-pwa` (service worker تلقائي وسجل للتحديثات).

## تشغيل المشروع
1. ثبت Node.js (>=18) و npm.
2. نفّذ:

```bash
npm install
npm run dev
```

ثم افتح http://localhost:5173

## ملاحظات مهمة
- ضع أيقونات PWA في `public/icons/`.
- قاعدة البيانات الآن في IndexedDB اسمه `shamsin-db`.
- تقارير PDF تحفظ ملف `report-<batchId>.pdf`.

## تطوير مقترح لاحق
- إضافة تصدير CSV ورفع سحابي (Firebase/Postgres).
- واجهات المستخدم: تحسين RTL وابتكار شعار رسمي.

---
