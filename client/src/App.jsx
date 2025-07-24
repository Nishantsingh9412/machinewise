import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import SensorManagement from './components/SensorManagement'
import HistoricalData from './components/HistoricalData'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sensors" element={<SensorManagement />} />
        <Route path="/historical" element={<HistoricalData />} />
      </Routes>
    </Router>
  )
}

export default App
