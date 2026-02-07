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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧠</span>
            <h1 className="text-xl font-bold text-gray-900">MarketMind AI</h1>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
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
      <div className="min-h-screen bg-gray-50">
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
