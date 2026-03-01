# 🔐 Auth System

A production-ready authentication system built with Next.js, NestJS, PostgreSQL, and Docker.

It provides secure JWT authentication with refresh tokens stored in HTTP-only cookies.

---

## 🚀 Getting Started

Follow the steps below to run the project locally.

---

## 📦 Prerequisites

Make sure you have installed:

- Docker & Docker Compose  
- Node.js 18+  
- Git  

---

## 🏃 Quick Setup

```bash
git clone https://github.com/Bm3045/-secure-auth-system/tree/main
cd auth-system
docker-compose up -d --build
```

---

## ⚙️ Environment Setup

Create environment files before running:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

---

## ▶️ Running the Application

Start services:

```bash
docker-compose up -d --build
```

View logs:

```bash
docker-compose logs -f
```

Check running containers:

```bash
docker-compose ps
```

---

## 🌐 Available URLs

- Frontend: http://localhost:3000  
- Backend API: http://localhost:3001  
- Health Check: http://localhost:3001/auth/health  

---

## 🧩 Tech Stack

- Frontend: Next.js  
- Backend: NestJS  
- Database: PostgreSQL  
- Containerization: Docker  
- Authentication: JWT + Refresh Tokens  

---

## 🔒 Authentication Features

- JWT-based authentication  
- Refresh token rotation  
- HTTP-only cookie storage  
- Secure password hashing  
- API health monitoring  

---

## 🛠 Docker Commands

Stop services:

```bash
docker-compose down
```

Rebuild containers:

```bash
docker-compose up -d --build
```

Reset database:

```bash
docker-compose down -v
```

---

## 📚 Learn More

- https://nextjs.org/docs  
- https://docs.nestjs.com  
- https://www.postgresql.org/docs/  
- https://docs.docker.com/
