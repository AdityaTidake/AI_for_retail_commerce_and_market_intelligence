import { useState } from 'react'
import axios from 'axios'

const API_URL = '/api'

export default function AICopilot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your MarketMind AI assistant. Ask me anything about your retail business - inventory, forecasts, customer feedback, or pricing strategies.',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  
  const suggestedQuestions = [
    'What should I restock this week?',
    'Which products are trending?',
    'Summarize customer complaints',
    'What are the pricing recommendations?',
    'Show me inventory risks',
  ]
  
  const handleSend = async (question = input) => {
    if (!question.trim()) return
    
    const userMessage = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    
    try {
      const response = await axios.post(`${API_URL}/chat`, { question })
      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        actionItems: response.data.action_items,
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend is running and your OpenAI API key is configured.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Retail Copilot</h2>
        <p className="text-gray-600">Ask questions about your business intelligence</p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.actionItems && message.actionItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs font-semibold mb-2">Action Items:</p>
                    <ul className="text-xs space-y-1">
                      {message.actionItems.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t p-4">
          <div className="flex space-x-2 mb-3">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your retail business..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
