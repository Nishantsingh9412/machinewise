# MachineWise IoT Dashboard

Built a real-time dashboard for monitoring industrial machine sensors. Has a landing page and dashboard with live data updates.

**Live Demo:** https://machinewise-d9g8cwe3e0ardzhh.eastus-01.azurewebsites.net/

## What's Inside

```
client/          - React frontend 
server/          - Node.js backend
```

## What It Does

**Landing Page:**
- Clean design with company info
- Shows preview of dashboard
- Button to go to main dashboard

**Dashboard:**
- Shows temperature, vibration, current, voltage
- Updates every 5 seconds automatically  
- Changes color when values get too high
- Shows alerts when thresholds crossed
- Machine status: Healthy/Warning/Critical

**Backend:**
- Generates random sensor data to simulate real machines
- REST API with CORS enabled
- Smart logic for machine status

## Running It

**Live Demo:** https://machinewise-d9g8cwe3e0ardzhh.eastus-01.azurewebsites.net/

**Local Development:**
```bash
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:3001

## How I Built It

Started with the requirements - needed React frontend and Node backend. Made it look professional since this is for a job application.

For the frontend, used React Router to have separate landing page and dashboard. Styled with Tailwind CSS because it's fast and looks good. Dashboard fetches data every 5 seconds and shows everything clearly with colors and progress bars.

Backend is simple - Express server that generates random sensor values. The status logic matches exactly what was asked:
- Critical: temp > 80°C AND vibration > 20 mm/s  
- Warning: either one is over the limit
- Healthy: everything normal

Used modern JavaScript (ES6) throughout because that's what companies expect now.

## If This Was Real Production

Would need:
- Real database instead of random data
- User authentication 
- WebSockets for instant updates
- Better error handling
- Tests (unit + integration)
- Docker for deployment
- Monitoring and logging
- Security (rate limiting, validation)

## Tech Used

- React 18 + React Router
- Node.js + Express  
- Tailwind CSS
- Vite (fast builds)
- ES6 modules everywhere

---

Made for MachineWise technical assessment
