import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Overview from './pages/Overview'
import Forecasting from './pages/Forecasting'
import Inventory from './pages/Inventory'
import CustomerInsights from './pages/CustomerInsights'
import AICopilot from './pages/AICopilot'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Overview', icon: '📊' },
    { path: '/forecasting', label: 'Forecasting', icon: '📈' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/insights', label: 'Customer Insights', icon: '💬' },
    { path: '/copilot', label: 'AI Copilot', icon: '🤖' },
  ]
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg border-b border-white/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MarketMind AI</h1>
              <p className="text-xs text-white/80">Intelligent Retail Analytics</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  location.pathname === item.path
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/insights" element={<CustomerInsights />} />
            <Route path="/copilot" element={<AICopilot />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
