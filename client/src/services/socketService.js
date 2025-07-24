import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    connect() {
        const serverUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        this.socket = io(serverUrl, {
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            this.isConnected = true;
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.isConnected = false;
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    onSensorData(callback) {
        if (this.socket) {
            this.socket.on('sensorData', callback);
        }
    }

    onSensorError(callback) {
        if (this.socket) {
            this.socket.on('sensorError', callback);
        }
    }

    requestSensorData() {
        if (this.socket && this.isConnected) {
            this.socket.emit('requestSensorData');
        }
    }

    getSocket() {
        return this.socket;
    }

    getConnectionStatus() {
        return this.isConnected;
    }
}

export default new SocketService();
