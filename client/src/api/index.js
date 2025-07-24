import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' });

export const getSensorDataAPI = () => API.get("api/sensor-data");

export const getAllSensorsAPI = () => API.get("api/sensors");
export const createSensorAPI = (sensorData) => API.post("api/sensors", sensorData);
export const updateSensorAPI = (id, sensorData) => API.put(`api/sensors/${id}`, sensorData);
export const deleteSensorAPI = (id) => API.delete(`api/sensors/${id}`);

export const getHistoricalDataAPI = (params) => API.get("api/sensors/historical", { params });