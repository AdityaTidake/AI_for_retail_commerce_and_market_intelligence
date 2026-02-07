import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = '/api'

function RiskBadge({ level }) {
  const styles = {
    HIGH: 'bg-red-100 text-red-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800',
  }
  
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>
      {level}
    </span>
  )
}

export default function Inventory() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('ALL')
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      const response = await axios.get(`${API_URL}/stock-alerts`)
      setData(response.data)
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div className="text-center py-12">Loading inventory data...</div>
  }
  
  const filteredAlerts = filter === 'ALL' 
    ? data.alerts 
    : data.alerts.filter(a => a.risk_level === filter)
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Inventory Management</h2>
        <p className="text-gray-600">Stock alerts and reorder recommendations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Alerts</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{data.critical_count}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-2xl">
              🚨
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Warning Alerts</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{data.warning_count}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-2xl">
              ⚠️
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{data.alerts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
              📦
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
            <div className="flex space-x-2">
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Left
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  7-Day Demand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Until Stockout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Qty
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlerts.map((alert, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {alert.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {alert.stock_left} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {alert.forecasted_demand_7d} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {alert.days_until_stockout} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RiskBadge level={alert.risk_level} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {alert.reorder_qty > 0 ? `${alert.reorder_qty} units` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
