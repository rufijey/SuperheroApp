# Superhero App

A web application for managing a superheroes database.  
- **Frontend** (React/Vite)  
- **Backend** (NestJS + TypeORM)  
- **Database** (PostgreSQL)  

All services run via **Docker Compose**.

---

## ⚙️ Environment Variables

Create a file **`backend/.env`** with the following variables:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=superheroes
POSTGRES_HOST=db
POSTGRES_PORT=5432
PORT=3000
```

## Run with docker
docker-compose up --build

### Services Access

Frontend → http://localhost:5173

Backend API → http://localhost:3000

Postgres DB → localhost:5433 (mapped from container 5432)

## Run without docker

### Install dependencies

cd backend
npm install

cd /frontend
npm install

### Start PostgreSQL locally

You have to run PostgreSQL on your machine and create database superheroes

### Start backend
cd backend   
npm run start:dev

Backend will run on → http://localhost:3000

### Start frontend
cd frontend   
npm run dev

Frontend will run on → http://localhost:5173

