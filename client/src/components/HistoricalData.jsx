import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllSensorsAPI, getHistoricalDataAPI } from '../api/index.js'

const HistoricalData = () => {
  const [sensors, setSensors] = useState([])
  const [selectedSensor, setSelectedSensor] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [historicalData, setHistoricalData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSensors()
    
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    setEndDate(today.toISOString().split('T')[0])
    setStartDate(yesterday.toISOString().split('T')[0])
  }, [])

  const fetchSensors = async () => {
    try {
      const response = await getAllSensorsAPI()
      if (response.data.success) {
        setSensors(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch sensors')
    }
  }

  const fetchHistoricalData = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const params = {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate + 'T23:59:59').toISOString(),
        limit: 1000
      }
      
      if (selectedSensor) {
        params.sensorId = selectedSensor
      }

      const response = await getHistoricalDataAPI(params)
      console.log(response);
      if (response.data.success) {
        setHistoricalData(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch historical data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'text-red-600 bg-red-100'
      case 'Warning': return 'text-yellow-600 bg-yellow-100'
      case 'Normal': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
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
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 cursor-pointer">Dashboard</Link>
              <Link to="/sensors" className="text-gray-600 hover:text-gray-800 cursor-pointer">Sensors</Link>
              <span className="text-gray-600">Historical Data</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Historical Sensor Data</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sensor</label>
              <select
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Sensors</option>
                {sensors.map((sensor) => (
                  <option key={sensor._id} value={sensor._id}>
                    {sensor.name} ({sensor.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchHistoricalData}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {historicalData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Found {historicalData.length} records
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sensor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Threshold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicalData.map((record, index) => (
                    <tr key={index} className={record.isAlert ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.sensorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.sensorType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.value} {record.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.threshold} {record.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && historicalData.length === 0 && startDate && endDate && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Found</h3>
              <p className="text-gray-500">No sensor data found for the selected criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoricalData
