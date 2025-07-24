import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import dotenv from "dotenv";

import connectDB from "./config/database.js";
import initializeDatabase from "./init-db.js";
import sensorRoutes from "./routes/sensor.js";
import socketService from "./services/socketService.js";
import mqttService from "./services/mqttService.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

connectDB();
initializeDatabase();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api", sensorRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static("./frontend/dist"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./frontend", "dist", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.json({ 
            message: "MachineWise IoT Dashboard API",
            version: "2.0.0",
            features: ["MongoDB", "Socket.io", "MQTT", "Historical Data"]
        });
    });
}

socketService.initialize(server);

mqttService.connect();

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    socketService.stopDataStreaming();
    mqttService.disconnect();
    process.exit(0);
});

server.listen(PORT, () => {
    console.log(`MachineWise server running on port ${PORT}`);
    console.log(`Database: MongoDB`);
    console.log(`WebSockets: Enabled`);
    console.log(`MQTT: ${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`);
});