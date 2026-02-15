import { useState, useRef, useEffect } from 'react'

function FloatingCopilot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! How can I assist you today?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const suggestedQuestions = [
    { icon: '📈', text: 'What are the sales trends?' },
    { icon: '📦', text: 'Which products need restocking?' },
    { icon: '💰', text: 'Show pricing recommendations' },
    { icon: '💬', text: 'What is customer sentiment?' },
    { icon: '🎯', text: 'Top performing products?' },
    { icon: '📊', text: 'Generate sales forecast' },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInputValue('')
    setIsTyping(true)
    setShowSuggestions(false)

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      })
      
      const data = await response.json()
      setIsTyping(false)
      setMessages(prev => [...prev, { type: 'bot', text: data.answer || 'I apologize, but I encountered an error.' }])
    } catch (error) {
      setIsTyping(false)
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I am currently unavailable. Please ensure the backend is running.' 
      }])
    }
  }

  const handleSuggestionClick = (question) => {
    setInputValue(question)
    setShowSuggestions(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Error starting speech recognition:', error)
      }
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all duration-300 z-50 ${
          isOpen 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 scale-90' 
            : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:scale-110 animate-pulse-slow'
        }`}
        style={{
          boxShadow: isOpen 
            ? '0 10px 40px rgba(168, 85, 247, 0.4)' 
            : '0 10px 40px rgba(59, 130, 246, 0.5)'
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl transition-all duration-500 z-40 ${
          isOpen 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-[450px] pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AI Copilot Assistant</h3>
                <p className="text-white/80 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[440px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Suggested Questions */}
          {showSuggestions && messages.length === 1 && (
            <div className="space-y-3 animate-slide-up">
              <p className="text-xs text-gray-500 font-medium px-1">Suggested questions:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl border border-purple-200 text-left transition-all hover:scale-105 hover:shadow-md group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                    <span className="text-sm text-gray-700 font-medium">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {isTyping && (
            <div className="flex justify-start animate-slide-up">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-md border border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
            <button
              onClick={handleVoiceInput}
              className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
              title={isListening ? 'Listening... Click to stop' : 'Voice input'}
            >
              {isListening ? (
                <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FloatingCopilot
