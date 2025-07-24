import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import socketService from '../services/socketService.js'

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = socketService.connect()

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socketService.onSensorData((data) => {
      setSensorData(data)
      setLastUpdate(new Date())
      setError(null)
      setLoading(false)
    })

    socketService.onSensorError((errorData) => {
      setError(errorData.message)
      setLoading(false)
    })

    socketService.requestSensorData()

    return () => {
      socketService.disconnect()
    }
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'bg-red-500'
      case 'Warning': return 'bg-yellow-500'
      case 'Healthy': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getSensorColor = (sensor) => {
    if (sensor.isAlert) return 'text-red-600'
    return 'text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl">Connecting to real-time data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              MachineWise
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/sensors" className="text-gray-600 hover:text-gray-800 cursor-pointer">Manage Sensors</Link>
              <Link to="/historical" className="text-gray-600 hover:text-gray-800 cursor-pointer">Historical Data</Link>
              <Link 
                to="/" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Real-time Machine Monitoring
              </h1>
              <p className="text-gray-600">Live sensor data via WebSocket connection</p>
            </div>
            <div className="text-right">
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {lastUpdate && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Last updated</div>
                  <div className="text-lg font-semibold text-gray-700">
                    {lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error: {error}</span>
          </div>
        )}

        {sensorData && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Machine Status</h2>
                  <p className="text-gray-600 text-sm">Current operational state</p>
                </div>
                <div className={`px-6 py-3 rounded-full text-white font-semibold text-lg shadow-lg ${getStatusColor(sensorData.status)}`}>
                  {sensorData.status}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {sensorData.sensors && sensorData.sensors.map((sensor, index) => (
                <div key={sensor.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">{sensor.name}</h3>
                    <div className="text-3xl">
                      {sensor.type === 'temperature' && '🌡️'}
                      {sensor.type === 'vibration' && '📳'}
                      {sensor.type === 'current' && '⚡'}
                      {sensor.type === 'voltage' && '🔌'}
                    </div>
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${getSensorColor(sensor)}`}>
                    {sensor.value}{sensor.unit}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Threshold: {sensor.threshold}{sensor.unit}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${sensor.isAlert ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ 
                        width: `${Math.min((sensor.value / (sensor.threshold * 1.5)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  {sensor.isAlert && (
                    <div className="mt-2 text-sm text-red-600 font-medium">
                      ⚠️ Alert: Above threshold
                    </div>
                  )}
                </div>
              ))}
            </div>

            {sensorData.alerts && sensorData.alerts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Active Alerts ({sensorData.alerts.length})
                </h2>
                <div className="space-y-3">
                  {sensorData.alerts.map((alert, index) => (
                    <div key={index} className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r flex items-center">
                      <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Machine Status Logic</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                    <div className="font-semibold text-red-800 text-lg">Critical</div>
                  </div>
                  <div className="text-red-700 text-sm">
                    Temperature {'>'} 80°C <strong>AND</strong> Vibration {'>'} 20 mm/s
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                    <div className="font-semibold text-yellow-800 text-lg">Warning</div>
                  </div>
                  <div className="text-yellow-700 text-sm">
                    Temperature {'>'} 80°C <strong>OR</strong> Vibration {'>'} 20 mm/s
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <div className="font-semibold text-green-800 text-lg">Healthy</div>
                  </div>
                  <div className="text-green-700 text-sm">
                    All parameters within normal operating range
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
