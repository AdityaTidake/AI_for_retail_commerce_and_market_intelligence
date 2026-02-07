import { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const API_URL = '/api'

export default function CustomerInsights() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentiment`)
      setData(response.data)
    } catch (error) {
      console.error('Error loading sentiment:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div className="text-center py-12">Loading customer insights...</div>
  }
  
  const sentimentData = [
    { name: 'Positive', value: data.overall_sentiment.positive, color: '#10b981' },
    { name: 'Negative', value: data.overall_sentiment.negative, color: '#ef4444' },
  ]
  
  const issuesData = data.top_issues.map(issue => ({
    name: issue.issue.charAt(0).toUpperCase() + issue.issue.slice(1),
    count: issue.count,
  }))
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Insights</h2>
        <p className="text-gray-600">Sentiment analysis and feedback intelligence</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Reviews</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.overall_sentiment.total_reviews}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Positive Reviews</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{data.overall_sentiment.positive}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Negative Reviews</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{data.overall_sentiment.negative}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customer Issues</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issuesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Sentiment Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(data.product_sentiment).map(([product, sentiment]) => (
            <div key={product} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{product}</span>
                <span className="text-sm text-gray-600">{sentiment.total} reviews</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-green-600">Positive: {sentiment.positive}</span>
                    <span className="text-red-600">Negative: {sentiment.negative}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${sentiment.positive_rate}%` }}
                    />
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{sentiment.positive_rate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
        <div className="space-y-3">
          {data.sample_reviews.slice(0, 5).map((review, idx) => (
            <div key={idx} className="border-l-4 p-3 bg-gray-50" style={{
              borderColor: review.sentiment === 'POSITIVE' ? '#10b981' : '#ef4444'
            }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900">{review.product}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  review.sentiment === 'POSITIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {review.sentiment}
                </span>
              </div>
              <p className="text-sm text-gray-700">{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
