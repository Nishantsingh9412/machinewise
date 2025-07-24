import mongoose from 'mongoose';
import Sensor from './models/Sensor.js';

const initializeDatabase = async () => {
  try {
    const sensorCount = await Sensor.countDocuments();
    
    if (sensorCount === 0) {
      console.log('Creating default sensors...');
      
      const defaultSensors = [
        {
          name: 'Temperature',
          type: 'temperature',
          unit: '°C',
          threshold: 80,
          minValue: 20,
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
          minValue: 5,
          maxValue: 20
        },
        {
          name: 'Voltage',
          type: 'voltage',
          unit: 'V',
          threshold: 250,
          minValue: 200,
          maxValue: 300
        }
      ];

      await Sensor.insertMany(defaultSensors);
      console.log('Default sensors created successfully');
    } else {
      console.log(`Found ${sensorCount} existing sensors`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase;
