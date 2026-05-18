# Real-Time Patient Monitoring System

A full-stack real-time healthcare monitoring dashboard that simulates patient vitals, evaluates clinical alerts, and streams live updates to a React frontend using Socket.IO.

## Features

### Real-Time Monitoring

* Live patient vital streaming every 5 seconds
* Real-time frontend synchronization using WebSockets
* Automated backend vitals generation
* Dynamic React dashboard updates without page refreshes

### Patient Management

* Create and retrieve patients
* Patient-specific vitals tracking
* Patient-specific alert history architecture
* MongoDB persistence with Mongoose

### Clinical Alert Engine

* Automatic alert evaluation based on simulated vitals
* Tachycardia detection
* Bradycardia detection
* Hypoxia detection
* Hypertension detection
* Fever detection
* Severity classification system

### Alert Workflow Management

* Active alert lifecycle management
* Alert deduplication by patient and alert type
* Realtime alert updates
* Alert acknowledgment workflow
* Severity-based alert styling

### Data Visualization

* Real-time heart rate charts using Recharts
* Rolling time-series visualization
* Historical vitals state tracking

---

# Tech Stack

## Frontend

* React
* Vite
* Socket.IO Client
* Recharts

## Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB Atlas
* Mongoose

---

# System Architecture

## Backend Architecture

The backend follows a modular architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

### Key Backend Components

| Component    | Responsibility                |
| ------------ | ----------------------------- |
| Routes       | API endpoint mapping          |
| Controllers  | Request/response handling     |
| Services     | Business logic and automation |
| Models       | Database schemas              |
| Socket Layer | Realtime event broadcasting   |

---

# Realtime Architecture

The application combines:

## REST APIs

Used for:

* Initial state hydration
* Historical data retrieval
* CRUD operations

## WebSockets (Socket.IO)

Used for:

* Realtime vital updates
* Realtime alert broadcasting
* Live frontend synchronization

### Event Flow

```text
Backend Automation
        ↓
Generate Vitals
        ↓
Save to MongoDB
        ↓
Evaluate Alerts
        ↓
Emit Socket.IO Events
        ↓
Frontend Receives Updates
        ↓
Realtime Dashboard Refresh
```

---

# API Endpoints

## Patient Endpoints

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/patients`     | Retrieve all patients   |
| GET    | `/api/patients/:id` | Retrieve single patient |
| POST   | `/api/patients`     | Create patient          |

## Vital Endpoints

| Method | Endpoint                                   | Description                   |
| ------ | ------------------------------------------ | ----------------------------- |
| GET    | `/api/patients/:patientId/vitals`          | Retrieve patient vitals       |
| GET    | `/api/patients/:patientId/vitals/latest`   | Retrieve latest patient vital |
| POST   | `/api/patients/:patientId/vitals/simulate` | Generate simulated vital      |

## Alert Endpoints

| Method | Endpoint                      | Description       |
| ------ | ----------------------------- | ----------------- |
| GET    | `/api/alerts`                 | Retrieve alerts   |
| PATCH  | `/api/alerts/:id/acknowledge` | Acknowledge alert |

---

# Clinical Alert Rules

| Condition              | Alert Type   | Severity |
| ---------------------- | ------------ | -------- |
| Heart Rate > 120       | Tachycardia  | High     |
| Heart Rate < 50        | Bradycardia  | High     |
| Oxygen Saturation < 92 | Hypoxia      | Critical |
| Systolic BP > 180      | Hypertension | Critical |
| Temperature > 103°F    | Fever        | High     |

---

# Realtime Dashboard Features

## Live Vitals

* Heart rate
* Blood pressure
* Oxygen saturation
* Temperature

## Realtime Charts

* Heart rate trend visualization
* Rolling historical window
* Continuous chart updates

## Alert Dashboard

* Active alerts display
* Severity color coding
* Realtime alert updates
* Alert acknowledgment workflow

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd patient-monitoring-system
```

---

# Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start backend:

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

---

# Project Structure

```text
patient-monitoring-system/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── app.js
│   │   └── server.js
│   └── .env
│
└── README.md
```

---

# Future Improvements

* Authentication and authorization
* Multi-chart vitals dashboard
* Patient detail pages
* Historical analytics
* Alert filtering and search
* Docker deployment
* Kubernetes scaling
* Redis pub/sub
* Kafka event streaming
* Unit and integration testing
* CI/CD pipeline

---

# Key Engineering Concepts Demonstrated

* Realtime distributed systems
* Event-driven architecture
* REST + WebSocket hybrid architecture
* Time-series state management
* Backend automation workflows
* Modular backend design
* Realtime frontend synchronization
* Clinical alert lifecycle management
* MongoDB relational-style modeling
* React state management

---

# Screenshots

*Add dashboard screenshots here.*

---

# License

This project is for educational and portfolio purposes.
