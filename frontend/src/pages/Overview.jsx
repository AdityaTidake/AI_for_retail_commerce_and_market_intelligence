import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = '/api'

function StatCard({ title, value, subtitle, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function AlertCard({ alert, type = 'warning' }) {
  const typeStyles = {
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
  }
  
  return (
    <div className={`border-l-4 p-4 ${typeStyles[type]}`}>
      <p className="text-sm font-medium text-gray-900">{alert}</p>
    </div>
  )
}

export default function Overview() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    forecast: null,
    inventory: null,
    sentiment: null,
  })
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      const [forecastRes, inventoryRes, sentimentRes] = await Promise.all([
        axios.get(`${API_URL}/forecast`),
        axios.get(`${API_URL}/stock-alerts`),
        axios.get(`${API_URL}/sentiment`),
      ])
      
      setData({
        forecast: forecastRes.data,
        inventory: inventoryRes.data,
        sentiment: sentimentRes.data,
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }
  
  const totalReviews = data.sentiment?.overall_sentiment?.total_reviews || 0
  const positiveRate = totalReviews > 0 
    ? Math.round((data.sentiment.overall_sentiment.positive / totalReviews) * 100)
    : 0
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Real-time retail intelligence and insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Rising Products"
          value={data.forecast?.rising_products?.length || 0}
          subtitle="High demand growth"
          icon="📈"
          color="green"
        />
        <StatCard
          title="Stock Alerts"
          value={data.inventory?.critical_count || 0}
          subtitle="Critical inventory issues"
          icon="⚠️"
          color="red"
        />
        <StatCard
          title="Customer Satisfaction"
          value={`${positiveRate}%`}
          subtitle={`${totalReviews} reviews analyzed`}
          icon="😊"
          color="blue"
        />
        <StatCard
          title="Top Issues"
          value={data.sentiment?.top_issues?.length || 0}
          subtitle="Customer complaints"
          icon="🔍"
          color="yellow"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Critical Alerts</h3>
          <div className="space-y-3">
            {data.forecast?.alerts?.map((alert, idx) => (
              <AlertCard key={idx} alert={alert} type="info" />
            ))}
            {data.inventory?.alerts
              ?.filter(a => a.risk_level === 'HIGH')
              .slice(0, 3)
              .map((alert, idx) => (
                <AlertCard
                  key={idx}
                  alert={`${alert.product}: Only ${alert.stock_left} units left (${alert.days_until_stockout} days until stockout)`}
                  type="danger"
                />
              ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Top Customer Issues</h3>
          <div className="space-y-4">
            {data.sentiment?.top_issues?.slice(0, 5).map((issue, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">{issue.issue}</p>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${issue.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-semibold text-gray-700">{issue.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Trending Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.forecast?.rising_products?.map((product, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <p className="font-medium text-gray-900">{product.product}</p>
              <p className="text-2xl font-bold text-green-600 mt-2">+{product.growth_rate}%</p>
              <p className="text-sm text-gray-600 mt-1">
                Avg: {product.avg_daily_demand} units/day
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
