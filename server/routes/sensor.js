import express from 'express';

import { generateSensorData } from '../controller/sensorController.js';

const router = express.Router();

router.get('/sensor-data', generateSensorData);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;