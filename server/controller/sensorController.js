
import Sensor from '../models/Sensor.js';
import SensorData from '../models/SensorData.js';

export const getAllSensors = async (req, res) => {
    try {
        const sensors = await Sensor.find({ isActive: true }).sort({ createdAt: -1 });
        console.log(sensors)

        return res.status(200).json({
            success: true,
            message: "Sensors retrieved successfully",
            data: sensors
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving sensors",
            error: error.message
        });
    }
};

export const createSensor = async (req, res) => {
    try {
        const { name, type, unit, threshold, minValue, maxValue } = req.body;
        
        const existingSensor = await Sensor.findOne({ name });
        if (existingSensor) {
            return res.status(400).json({
                success: false,
                message: "Sensor with this name already exists"
            });
        }

        const sensor = await Sensor.create({
            name,
            type,
            unit,
            threshold,
            minValue,
            maxValue
        });
        
        if (!sensor) {
            return res.status(400).json({
                success: false,
                message: "Failed to create sensor"
            });
        }
        
        return res.status(201).json({
            success: true,
            message: "Sensor created successfully",
            data: sensor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating sensor",
            error: error.message
        });
    }
};

export const updateSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const sensor = await Sensor.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!sensor) {
            return res.status(404).json({
                success: false,
                message: "Sensor not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Sensor updated successfully",
            data: sensor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating sensor",
            error: error.message
        });
    }
};

export const deleteSensor = async (req, res) => {
    try {
        const { id  : _id} = req.params;
        const sensor = await Sensor.findByIdAndDelete(_id);

        if (!sensor) {
            return res.status(404).json({
                success: false,
                message: "Sensor not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Sensor deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting sensor",
            error: error.message
        });
    }
};

export const generateSensorData = async () => {
    try {
        const sensors = await Sensor.find({ isActive: true });
        
        if (sensors.length === 0) {
            await initializeDefaultSensors();
            return await generateSensorData();
        }
        
        const sensorDataArray = [];
        let overallStatus = "Healthy";
        let alerts = [];
        
        for (const sensor of sensors) {
            const value = Math.random() * (sensor.maxValue - sensor.minValue) + sensor.minValue;
            const roundedValue = parseFloat(value.toFixed(1));
            
            const isAlert = roundedValue > sensor.threshold;
            let status = "Normal";
            
            if (isAlert) {
                status = "Warning";
                alerts.push(`${sensor.name} ${status.toLowerCase()}: ${roundedValue}${sensor.unit}`);
            }
            
            const sensorDataEntry = new SensorData({
                sensorId: sensor._id,
                sensorName: sensor.name,
                sensorType: sensor.type,
                value: roundedValue,
                unit: sensor.unit,
                threshold: sensor.threshold,
                isAlert,
                status,
                timestamp: new Date()
            });
            
            await sensorDataEntry.save();
            sensorDataArray.push({
                id: sensor._id,
                name: sensor.name,
                type: sensor.type,
                value: roundedValue,
                unit: sensor.unit,
                threshold: sensor.threshold,
                isAlert,
                status
            });
        }
        
        const tempSensor = sensorDataArray.find(s => s.type === 'temperature');
        const vibrationSensor = sensorDataArray.find(s => s.type === 'vibration');
        
        if (tempSensor && vibrationSensor) {
            if (tempSensor.value > 80 && vibrationSensor.value > 20) {
                overallStatus = "Critical";
            } else if (tempSensor.value > 80 || vibrationSensor.value > 20) {
                overallStatus = "Warning";
            }
        }
        
        return {
            timestamp: new Date().toISOString(),
            sensors: sensorDataArray,
            status: overallStatus,
            alerts
        };
    } catch (error) {
        console.error('Error generating sensor data:', error);
        throw error;
    }
};

export const getSensorData = async (req, res) => {
    try {
        const data = await generateSensorData();
        
        return res.status(200).json({
            success: true,
            message: "Sensor data retrieved successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getHistoricalData = async (req, res) => {
    try {
        const { sensorId, startDate, endDate, limit = 100 } = req.query;
        
        let query = {};
        
        if (sensorId) {
            query.sensorId = sensorId;
        }
        
        if (startDate && endDate) {
            query.timestamp = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const historicalData = await SensorData.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .populate('sensorId', 'name type unit');
        
        return res.status(200).json({
            success: true,
            message: "Historical data retrieved successfully",
            data: historicalData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving historical data",
            error: error.message
        });
    }
};

const initializeDefaultSensors = async () => {
    const defaultSensors = [
        {
            name: 'Temperature',
            type: 'temperature',
            unit: '°C',
            threshold: 80,
            minValue: 0,
            maxValue: 100
        },
        {
            name: 'Vibration',
            type: 'vibration',
            unit: 'mm/s',
            threshold: 20,
            minValue: 0,
            maxValue: 30
        },
        {
            name: 'Current',
            type: 'current',
            unit: 'A',
            threshold: 15,
            minValue: 0,
            maxValue: 20
        },
        {
            name: 'Voltage',
            type: 'voltage',
            unit: 'V',
            threshold: 250,
            minValue: 220,
            maxValue: 280
        }
    ];
    
    for (const sensorData of defaultSensors) {
        const existingSensor = await Sensor.findOne({ name: sensorData.name });
        if (!existingSensor) {
            await Sensor.create(sensorData);
        }
    }
};
