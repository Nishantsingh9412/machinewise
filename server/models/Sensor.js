import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['temperature', 'vibration', 'current', 'voltage','pressure']
    },
    unit: {
        type: String,
        required: true
    },
    threshold: {
        type: Number,
        required: true
    },
    minValue: {
        type: Number,
        required: true,
        default: 0
    },
    maxValue: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Sensor', sensorSchema);
