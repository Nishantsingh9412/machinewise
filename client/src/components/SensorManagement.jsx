import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllSensorsAPI, createSensorAPI, updateSensorAPI, deleteSensorAPI } from '../api/index.js'

const SensorManagement = () => {
  const [sensors, setSensors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingSensor, setEditingSensor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'temperature',
    unit: '',
    threshold: '',
    minValue: '',
    maxValue: ''
  })

  useEffect(() => {
    fetchSensors()
  }, [])

  const fetchSensors = async () => {
    try {
      const response = await getAllSensorsAPI()
      if (response.data.success) {
        setSensors(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch sensors')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSensor) {
        await updateSensorAPI(editingSensor._id, formData)
      } else {
        await createSensorAPI(formData)
      }
      
      setShowModal(false)
      setEditingSensor(null)
      setFormData({
        name: '',
        type: 'temperature',
        unit: '',
        threshold: '',
        minValue: '',
        maxValue: ''
      })
      fetchSensors()
    } catch (err) {
      setError('Failed to save sensor')
    }
  }

  const handleEdit = (sensor) => {
    setEditingSensor(sensor)
    setFormData({
      name: sensor.name,
      type: sensor.type,
      unit: sensor.unit,
      threshold: sensor.threshold,
      minValue: sensor.minValue,
      maxValue: sensor.maxValue
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sensor?')) {
      try {
        await deleteSensorAPI(id)
        fetchSensors()
      } catch (err) {
        setError('Failed to delete sensor')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl">Loading sensors...</div>
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
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 cursor-pointer">Dashboard</Link>
              <Link to="/historical" className="text-gray-600 hover:text-gray-800 cursor-pointer">Historical Data</Link>
              <span className="text-gray-600">Sensor Management</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Sensor Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Add New Sensor
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sensors.map((sensor) => (
                <tr key={sensor._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sensor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.threshold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sensor.minValue} - {sensor.maxValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(sensor)}
                      className="text-blue-600 hover:text-blue-900 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sensor._id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingSensor ? 'Edit Sensor' : 'Add New Sensor'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="temperature">Temperature</option>
                    <option value="vibration">Vibration</option>
                    <option value="current">Current</option>
                    <option value="voltage">Voltage</option>
                    <option value="pressure">Pressure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., °C, mm/s, A, V"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Threshold</label>
                  <input
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => setFormData({...formData, threshold: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Value</label>
                    <input
                      type="number"
                      value={formData.minValue}
                      onChange={(e) => setFormData({...formData, minValue: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Value</label>
                    <input
                      type="number"
                      value={formData.maxValue}
                      onChange={(e) => setFormData({...formData, maxValue: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingSensor(null)
                      setFormData({
                        name: '',
                        type: 'temperature',
                        unit: '',
                        threshold: '',
                        minValue: '',
                        maxValue: ''
                      })
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    {editingSensor ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SensorManagement
