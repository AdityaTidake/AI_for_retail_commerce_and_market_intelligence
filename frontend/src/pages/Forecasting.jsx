import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_URL = '/api'

export default function Forecasting() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      const response = await axios.get(`${API_URL}/forecast`)
      setData(response.data)
      if (response.data.forecasts.length > 0) {
        setSelectedProduct(response.data.forecasts[0].product)
      }
    } catch (error) {
      console.error('Error loading forecast:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div className="text-center py-12">Loading forecast data...</div>
  }
  
  const products = [...new Set(data.forecasts.map(f => f.product))]
  const chartData = data.forecasts
    .filter(f => f.product === selectedProduct)
    .map(f => ({
      date: new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      demand: f.forecasted_units
    }))
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Demand Forecasting</h2>
        <p className="text-gray-600">7-day demand predictions for all products</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {products.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                name="Forecasted Demand"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Rising Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Daily Demand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.rising_products.map((product, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    +{product.growth_rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {product.avg_daily_demand} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Trending Up
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Forecast Insights</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          {data.alerts.map((alert, idx) => (
            <li key={idx}>• {alert}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
