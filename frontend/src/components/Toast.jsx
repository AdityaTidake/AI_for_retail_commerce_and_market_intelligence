import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [onClose])
  
  const styles = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
    warning: 'from-yellow-500 to-orange-600',
  }
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`bg-gradient-to-r ${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[300px]`}>
        <span className="text-2xl">{icons[type]}</span>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  )
}
