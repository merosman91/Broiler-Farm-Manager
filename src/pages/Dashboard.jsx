// src/pages/Dashboard.jsx
import WeightChart from '../components/WeightChart';

export default function Dashboard({ batch, feed, mortality, weights }) {
  return (
    <div className="p-4 grid gap-4">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">الوزن</h2>
        <WeightChart data={weights} />
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">العلف المستهلك</h2>
        <p>{feed.reduce((t,f)=>t+Number(f.amount),0)} كجم</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">إجمالي النفوق</h2>
        <p>{mortality.reduce((t,m)=>t+Number(m.count),0)}</p>
      </div>
    </div>
  );
}
