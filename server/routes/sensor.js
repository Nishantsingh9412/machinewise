import express from 'express';
import { 
    getAllSensors, 
    createSensor, 
    updateSensor, 
    deleteSensor, 
    getSensorData,
    getHistoricalData 
} from '../controller/sensorController.js';

const router = express.Router();

router.get('/sensors', getAllSensors);
router.post('/sensors', createSensor);
router.put('/sensors/:id', updateSensor);
router.delete('/sensors/:id', deleteSensor);

router.get('/sensor-data', getSensorData);
router.get('/sensors/historical', getHistoricalData);

export default router;