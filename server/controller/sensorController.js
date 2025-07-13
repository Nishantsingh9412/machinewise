
export const generateSensorData = async (req, res) => {
    try {
        const TEMPERATURE_THRESHOLD = 80;
        const VIBRATION_THRESHOLD = 20;
        const CURRENT_THRESHOLD = 15;
        const VOLTAGE_THRESHOLD = 250;

        const temperature = Math.random() * 100;
        const vibration = Math.random() * 30;
        const current = Math.random() * 20;
        const voltage = 220 + Math.random() * 60;

        let status = "Healthy";
        let alerts = [];

        if (temperature > TEMPERATURE_THRESHOLD && vibration > VIBRATION_THRESHOLD) {
            status = "Critical";
        } else if (
            temperature > TEMPERATURE_THRESHOLD ||
            vibration > VIBRATION_THRESHOLD
        ) {
            status = "Warning";
        }

        if (temperature > TEMPERATURE_THRESHOLD) {
            alerts.push(`Temperature critical: ${temperature.toFixed(1)}°C`);
        }
        if (vibration > VIBRATION_THRESHOLD) {
            alerts.push(`Vibration critical: ${vibration.toFixed(1)} mm/s`);
        }
        if (current > CURRENT_THRESHOLD) {
            alerts.push(`Current high: ${current.toFixed(1)} A`);
        }
        if (voltage > VOLTAGE_THRESHOLD) {
            alerts.push(`Voltage high: ${voltage.toFixed(1)} V`);
        }

        const sensorData = {
            timestamp: new Date().toISOString(),
            sensors: {
                temperature: parseFloat(temperature.toFixed(1)),
                vibration: parseFloat(vibration.toFixed(1)),
                current: parseFloat(current.toFixed(1)),
                voltage: parseFloat(voltage.toFixed(1)),
            },
            status,
            alerts,
            thresholds: {
                temperature: TEMPERATURE_THRESHOLD,
                vibration: VIBRATION_THRESHOLD,
                current: CURRENT_THRESHOLD,
                voltage: VOLTAGE_THRESHOLD,
            },
        };

        return res.status(200).json({
            success: true,
            message: "Sensor data retrieved successfully",
            data: sensorData
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
