import mqtt from 'mqtt';
import Sensor from '../models/Sensor.js';
import SensorData from '../models/SensorData.js';

class MQTTService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    connect() {
        try {
            const options = {
                host: process.env.MQTT_HOST || 'broker.hivemq.com',
                port: process.env.MQTT_PORT || 1883,
                protocol: 'mqtt',
                clientId: `machinewise_${Math.random().toString(16).substr(2, 8)}`,
                clean: true,
                connectTimeout: 30000,
                reconnectPeriod: 1000,
            };

            this.client = mqtt.connect(options);

            this.client.on('connect', () => {
                console.log('Connected to MQTT broker');
                this.isConnected = true;
                this.subscribeToTopics();
            });

            this.client.on('message', this.handleMessage.bind(this));

            this.client.on('error', (error) => {
                console.error('MQTT connection error:', error);
                this.isConnected = false;
            });

            this.client.on('close', () => {
                console.log('MQTT connection closed');
                this.isConnected = false;
            });

        } catch (error) {
            console.error('Failed to connect to MQTT broker:', error);
        }
    }

    subscribeToTopics() {
        const topics = [
            'machinewise/sensors/temperature',
            'machinewise/sensors/vibration',
            'machinewise/sensors/current',
            'machinewise/sensors/voltage'
        ];

        topics.forEach(topic => {
            this.client.subscribe(topic, (err) => {
                if (err) {
                    console.error(`Failed to subscribe to ${topic}:`, err);
                } else {
                    console.log(`Subscribed to ${topic}`);
                }
            });
        });
    }

    async handleMessage(topic, message) {
        try {
            const data = JSON.parse(message.toString());
            console.log(`Received MQTT message on ${topic}:`, data);

            const topicParts = topic.split('/');
            const sensorType = topicParts[topicParts.length - 1];

            const sensor = await Sensor.findOne({ type: sensorType, isActive: true });
            
            if (sensor && data.value !== undefined) {
                const isAlert = data.value > sensor.threshold;
                const status = isAlert ? 'Warning' : 'Normal';

                const sensorDataEntry = new SensorData({
                    sensorId: sensor._id,
                    sensorName: sensor.name,
                    sensorType: sensor.type,
                    value: parseFloat(data.value),
                    unit: sensor.unit,
                    threshold: sensor.threshold,
                    isAlert,
                    status,
                    timestamp: new Date()
                });

                await sensorDataEntry.save();
                console.log(`Saved MQTT sensor data for ${sensor.name}: ${data.value}${sensor.unit}`);
            }
        } catch (error) {
            console.error('Error handling MQTT message:', error);
        }
    }

    publishSensorData(sensorType, value) {
        if (this.isConnected && this.client) {
            const topic = `machinewise/sensors/${sensorType}`;
            const payload = JSON.stringify({
                value,
                timestamp: new Date().toISOString()
            });

            this.client.publish(topic, payload, (err) => {
                if (err) {
                    console.error(`Failed to publish to ${topic}:`, err);
                } else {
                    console.log(`Published to ${topic}: ${payload}`);
                }
            });
        }
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.isConnected = false;
        }
    }
}

export default new MQTTService();
