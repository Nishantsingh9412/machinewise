import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import sensorRoutes from "./routes/sensor.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", sensorRoutes);

// app.listen(PORT, () => {
//   console.log(`🚀 MachineWise server running on port ${PORT}`);
// });

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./frontend/dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Welcome to MachineWise  API's ");
  });
}


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`MachineWise server running on port ${PORT}`);
});