import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getRecords } from '../lib/db'

export default function WeightChart({ activeBatchId }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!activeBatchId) {
      setData([])
      return
    }

    loadWeightData()
  }, [activeBatchId])

  async function loadWeightData() {
    setLoading(true)
    try {
      const records = await getRecords(activeBatchId)
      const weightData = records
        .filter(r => r.avg_weight && r.avg_weight > 0)
        .map(r => ({
          day: `يوم ${r.day}`,
          weight: r.avg_weight,
          fullWeight: r.avg_weight
        }))
        .sort((a, b) => {
          const dayA = parseInt(a.day.replace('يوم ', ''))
          const dayB = parseInt(b.day.replace('يوم ', ''))
          return dayA - dayB
        })
      
      setData(weightData)
    } catch (error) {
      console.error('Error loading weight data:', error)
    } finally {
      setLoading(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          <p className="intro">
            <strong>الوزن: {payload[0].value} جم</strong>
          </p>
        </div>
      )
    }
    return null
  }

  if (!activeBatchId) {
    return (
      <div className="card">
        <h4>منحنى نمو الوزن</h4>
        <p>اختر دفعة لعرض الرسم البياني</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="card">
        <h4>منحنى نمو الوزن</h4>
        <p>جاري تحميل البيانات...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <h4>منحنى نمو الوزن</h4>
        <p>لا توجد بيانات وزن مسجلة بعد</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h4>منحنى نمو الوزن</h4>
      <div style={{ width: '100%', height: 300, direction: 'ltr' }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ 
                value: 'الوزن (جرام)', 
                angle: -90, 
                position: 'insideLeft',
                offset: -10,
                style: { textAnchor: 'middle' }
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#d97706' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <style jsx>{`
        .custom-tooltip {
          background: white;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .custom-tooltip .label {
          margin: 0 0 4px 0;
          font-weight: 600;
          color: #1e293b;
        }
        
        .custom-tooltip .intro {
          margin: 0;
          color: #f59e0b;
        }
      `}</style>
    </div>
  )
                                }
