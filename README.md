# Expense Tracker

A full-stack expense tracking application with a Spring Boot backend and React frontend, containerized with Docker.

## Features
- **Dashboard Overview** – summary cards (total spent, max expense, most expensive area), monthly bar chart, category pie chart
- **Month Filter** – filter dashboard data to a specific month
- **Expense Management** – add, view, sort, search, paginate, and delete expenses
- **CSV Export** – download expenses data as a CSV file
- **Seed Data** – auto-seeds 39 sample expenses across 2025 and the current year on first run

## Tech Stack
- **Backend**: Java 21, Spring Boot 3, H2 Database, Maven
- **Frontend**: React, Vite, Recharts
- **Infrastructure**: Docker, Docker Compose, nginx

---

## Setup & Running

### Prerequisites
- Docker & Docker Compose installed (or Java 21 + Node 22 for local dev)

### Docker (recommended)
```bash
docker compose up --build
```
App runs at `http://localhost:80`.

### Local development
**Terminal 1 (backend):**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 (frontend):**
```bash
cd frontend
npm install
npm run dev
```
Frontend at `http://localhost:5173`, backend at `http://localhost:8080`.

### Or run both at once from root:
```bash
npm install
npm run dev
```
