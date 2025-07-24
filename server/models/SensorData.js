import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
    sensorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor',
        required: true
    },
    sensorName: {
        type: String,
        required: true
    },
    sensorType: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    threshold: {
        type: Number,
        required: true
    },
    isAlert: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Normal', 'Warning', 'Critical'],
        default: 'Normal'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

sensorDataSchema.index({ timestamp: -1 });
sensorDataSchema.index({ sensorId: 1, timestamp: -1 });

export default mongoose.model('SensorData', sensorDataSchema);
