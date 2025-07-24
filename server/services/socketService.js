import { Server } from 'socket.io';
import { generateSensorData } from '../controller/sensorController.js';

class SocketService {
    constructor() {
        this.io = null;
        this.interval = null;
    }

    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });

            socket.on('requestSensorData', async () => {
                try {
                    const data = await generateSensorData();
                    socket.emit('sensorData', data);
                } catch (error) {
                    socket.emit('sensorError', { message: 'Failed to get sensor data' });
                }
            });
        });

        this.startDataStreaming();
    }

    startDataStreaming() {
        this.interval = setInterval(async () => {
            try {
                if (this.io) {
                    const data = await generateSensorData();
                    this.io.emit('sensorData', data);
                }
            } catch (error) {
                console.error('Error streaming sensor data:', error);
            }
        }, 5000);
    }

    stopDataStreaming() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    emitSensorUpdate(data) {
        if (this.io) {
            this.io.emit('sensorData', data);
        }
    }

    getIO() {
        return this.io;
    }
}

export default new SocketService();
