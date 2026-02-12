import { useState, useEffect, useRef } from 'react'
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
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)
  
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
      
      setVoiceEnabled(true)
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      synthRef.current.cancel()
    }
  }, [])
  
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }
  
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }
  
  const speak = (text) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthRef.current.speak(utterance)
    }
  }
  
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }
  
  const suggestedQuestions = [
    'What should I restock this week?',
    'Which products are trending?',
    'Summarize customer complaints',
    'What are the pricing recommendations?',
    'Show me inventory risks',
  ]
  
  const handleSend = async (question = input) => {
    if (!question.trim()) return
    
    stopSpeaking()
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
      
      // Auto-speak the response if voice is enabled
      if (voiceEnabled) {
        speak(response.data.answer)
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend is running and your GROQ API key is configured.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <span className="text-4xl mr-3 animate-bounce-slow">🤖</span>
                AI Retail Copilot
              </h2>
              <p className="text-purple-100">Ask questions about your business intelligence</p>
            </div>
            {voiceEnabled && (
              <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-scale-in">
                <span className="text-sm font-medium">Voice Assistant</span>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}>
              <div className="flex items-start space-x-2 max-w-3xl">
                <div className={`flex-1 rounded-2xl p-4 shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-white text-gray-900 border-2 border-gray-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.actionItems && message.actionItems.length > 0 && (
                    <div className={`mt-3 pt-3 border-t ${message.role === 'user' ? 'border-white/30' : 'border-gray-200'}`}>
                      <p className="text-xs font-semibold mb-2">✅ Action Items:</p>
                      <ul className="text-xs space-y-1">
                        {message.actionItems.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {message.role === 'assistant' && voiceEnabled && (
                  <button
                    onClick={() => speak(message.content)}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-all transform hover:scale-110 bg-white rounded-full shadow-md"
                    title="Read aloud"
                  >
                    🔊
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-scale-in">
              <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t bg-gradient-to-r from-gray-50 to-white p-4">
          <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="px-4 py-2 text-xs bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 rounded-full transition-all transform hover:scale-105 disabled:opacity-50 whitespace-nowrap shadow-sm"
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
              onKeyDown={(e) => e.key === 'Enter' && !isListening && handleSend()}
              placeholder={isListening ? "🎤 Listening..." : "Ask me anything about your retail business..."}
              disabled={loading || isListening}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all"
            />
            {voiceEnabled && (
              <>
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={loading}
                  className={`px-4 py-3 rounded-xl transition-all font-medium shadow-lg transform hover:scale-105 ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                  } disabled:opacity-50`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? '🎤 Stop' : '🎤'}
                </button>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all font-medium shadow-lg transform hover:scale-105 animate-pulse"
                    title="Stop speaking"
                  >
                    🔇
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim() || isListening}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg transform hover:scale-105"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
