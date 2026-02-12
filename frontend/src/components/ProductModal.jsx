import { useEffect, useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const API_URL = '/api'

export default function ProductModal({ productName, onClose }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  
  useEffect(() => {
    loadProductData()
  }, [productName])
  
  const loadProductData = async () => {
    try {
      const response = await axios.get(`${API_URL}/product/${encodeURIComponent(productName)}`)
      setData(response.data)
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">Loading product details...</div>
        </div>
      </div>
    )
  }
  
  const salesChartData = data.sales_history.map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: s.units_sold
  }))
  
  const forecastChartData = data.forecast.map(f => ({
    date: new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    forecast: f.forecasted_units
  }))
  
  const combinedChartData = [...salesChartData, ...forecastChartData]
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.product}</h2>
            <p className="text-sm text-gray-600 mt-1">Comprehensive product analytics</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-1 px-6">
            {['overview', 'sales', 'reviews', 'actions'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Stock Left</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{data.stock_left}</p>
                  <p className="text-xs text-blue-600 mt-1">units</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Total Sales</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{data.metrics.total_sales}</p>
                  <p className="text-xs text-green-600 mt-1">units sold</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Avg Daily</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{data.metrics.avg_daily_sales}</p>
                  <p className="text-xs text-purple-600 mt-1">units/day</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-600 font-medium">Days of Stock</p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">{data.metrics.days_of_stock}</p>
                  <p className="text-xs text-yellow-600 mt-1">days left</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Pricing Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="text-xl font-bold text-gray-900">${data.pricing.current_price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Competitor Price</p>
                    <p className="text-xl font-bold text-gray-900">${data.pricing.competitor_price}</p>
                  </div>
                </div>
                {data.pricing.current_price > data.pricing.competitor_price && (
                  <div className="mt-3 p-2 bg-yellow-100 rounded text-sm text-yellow-800">
                    ⚠️ Priced higher than competitor
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Sales History & Forecast</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Historical Sales"
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Forecast"
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">7-Day Forecast</h3>
                <div className="grid grid-cols-7 gap-2">
                  {data.forecast.map((f, idx) => (
                    <div key={idx} className="bg-green-50 rounded p-2 text-center">
                      <p className="text-xs text-green-600">
                        {new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-lg font-bold text-green-900">{f.forecasted_units}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Customer Reviews</h3>
                <span className="text-sm text-gray-600">{data.metrics.total_reviews} total reviews</span>
              </div>
              
              {data.reviews.length > 0 ? (
                <div className="space-y-3">
                  {data.reviews.map((review, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews available for this product
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📦 Reorder Stock</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Based on current demand, recommended reorder quantity:
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    defaultValue={Math.ceil(data.metrics.avg_daily_sales * 14)}
                    className="px-4 py-2 border border-blue-300 rounded-lg w-32"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create Purchase Order
                  </button>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">💰 Adjust Pricing</h4>
                <p className="text-sm text-green-800 mb-3">
                  Current: ${data.pricing.current_price} | Competitor: ${data.pricing.competitor_price}
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={data.pricing.current_price}
                    className="px-4 py-2 border border-green-300 rounded-lg w-32"
                  />
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Update Price
                  </button>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">📊 Generate Report</h4>
                <p className="text-sm text-purple-800 mb-3">
                  Export detailed analytics for this product
                </p>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Download Product Report
                </button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">🔔 Set Alert</h4>
                <p className="text-sm text-yellow-800 mb-3">
                  Get notified when stock falls below threshold
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    defaultValue={50}
                    className="px-4 py-2 border border-yellow-300 rounded-lg w-32"
                    placeholder="Threshold"
                  />
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                    Create Alert
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
