# 🏗️ Arquitetura do Projeto Task Manager

## Visão Geral da Arquitetura

Este projeto segue uma arquitetura de **aplicação web full-stack** com separação clara entre frontend e backend, utilizando containers Docker para orquestração.

## 📊 Diagrama de Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOCKER COMPOSE                           │
│                     (Orquestração)                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐
        │   FRONTEND    │ │  BACKEND  │ │   DATABASE    │
        │   (React)     │ │ (Express) │ │ (PostgreSQL)  │
        │   Port: 3000  │ │Port: 3001 │ │  Port: 5432   │
        └───────────────┘ └───────────┘ └───────────────┘
                │               │               │
                │               │               │
        ┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐
        │   Vite Dev    │ │  Node.js  │ │   Prisma      │
        │   Server      │ │ + TSX     │ │   ORM         │
        └───────────────┘ └───────────┘ └───────────────┘
```

## 🔄 Fluxo de Dados

```
┌─────────────┐    HTTP/REST    ┌─────────────┐    SQL    ┌─────────────┐
│  Frontend   │ ──────────────► │  Backend    │ ────────► │  Database   │
│  (React)    │                 │ (Express)   │           │ (PostgreSQL)│
│             │ ◄────────────── │             │ ◄──────── │             │
└─────────────┘    JSON API     └─────────────┘   Prisma  └─────────────┘
```

## 🎯 Arquitetura Detalhada por Camada

### 1. **Frontend Layer** (React + TypeScript)

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND CONTAINER                       │
│                     (Port: 3000)                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   App.tsx   │  │ Components/ │  │ Services/   │          │
│  │ (Router)    │  │             │  │ api.ts      │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│         │                │                │                 │
│  ┌──────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐          │
│  │ Dashboard   │ │   Users      │ │   Tasks      │          │
│  │ Categories  │ │              │ │              │          │
│  └─────────────┘ └──────────────┘ └──────────────┘          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Vite Dev Server                        │    │
│  │         (Hot Module Replacement)                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Backend Layer** (Node.js + Express + TypeScript)

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND CONTAINER                        │
│                     (Port: 3001)                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  index.ts   │  │ Controllers/│  │ Middleware/ │          │
│  │ (Server)    │  │             │  │             │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│         │                │                │                 │
│  ┌──────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐          │
│  │ Routes/     │ │ userCtrl     │ │ errorHandler │          │
│  │ taskCtrl    │ │ taskCtrl     │ │ notFound     │          │
│  │ categoryCtrl│ │ categoryCtrl │ │              │          │
│  └─────────────┘ └──────────────┘ └──────────────┘          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Prisma Client                          │    │
│  │         (Database Access Layer)                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 3. **Database Layer** (PostgreSQL + Prisma)

```
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE CONTAINER                        │
│                     (Port: 5432)                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │    Users    │  │   Tasks     │  │ Categories  │          │
│  │   Table     │  │   Table     │  │   Table     │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│         │                │                │                 │
│  ┌──────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐          │
│  │ id (PK)     │ │ id (PK)      │ │ id (PK)      │          │
│  │ name        │ │ title        │ │ name         │          │
│  │ email (UK)  │ │ description  │ │ description  │          │
│  │ createdAt   │ │ status       │ │ createdAt    │          │
│  └─────────────┘ │ priority     │ └──────────────┘          │
│                  │ userId (FK)  │                           │
│                  │ categoryId   │                           │
│                  │ (FK)         │                           │
│                  │ createdAt    │                           │
│                  │ updatedAt    │                           │
│                  └──────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔗 Relacionamentos entre Entidades

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    USER     │       │    TASK     │       │  CATEGORY   │
│             │       │             │       │             │
│ id (PK)     │◄──────┤ userId (FK) │       │ id (PK)     │
│ name        │       │ id (PK)     │◄──────┤ name        │
│ email       │       │ title       │       │ description │
│ createdAt   │       │ description │       │ createdAt   │
│             │       │ status      │       │             │
│             │       │ priority    │       │             │
│             │       │ createdAt   │       │             │
│             │       │ updatedAt   │       │             │
└─────────────┘       └─────────────┘       └─────────────┘
     │ 1                    │ N                    │ 1
     │                      │                      │
     └──────────────────────┼──────────────────────┘
                            │ N
                            │
                    ┌───────▼───────────────┐
                    │   RELATION            │
                    │  1 User : N Tasks     │
                    │  1 Category : N Tasks │
                    └───────────────────────┘
```

## 🌐 Fluxo de Requisições HTTP

```
1. User Action (Frontend)
   │
   ▼
2. React Component
   │
   ▼
3. Axios HTTP Request
   │
   ▼
4. Express Route Handler
   │
   ▼
5. Controller Function
   │
   ▼
6. Zod Validation
   │
   ▼
7. Prisma Database Query
   │
   ▼
8. PostgreSQL Database
   │
   ▼
9. Response JSON
   │
   ▼
10. React State Update
    │
    ▼
11. UI Re-render
```

<!-- ## 🧪 Arquitetura de Testes

```
┌─────────────────────────────────────────────────────────────┐
│                    TESTING ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   UNIT      │    │INTEGRATION  │    │     E2E     │      │
│  │   TESTS     │    │   TESTS     │    │   TESTS     │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│         │                  │                  │             │
│  ┌──────▼──────┐  ┌────────▼────────┐ ┌──────▼──────┐      │
│  │ Validation  │  │ API Endpoints   │ │ User Flows  │      │
│  │ Schemas     │  │ Database        │ │ Navigation  │      │
│  │ Utils       │  │ Relationships   │ │ CRUD Ops    │      │
│  │ Components  │  │ Error Handling  │ │ Forms       │      │
│  └─────────────┘  └─────────────────┘ └─────────────┘      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              VITEST FRAMEWORK                       │   │
│  │         (Backend + Frontend Testing)                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
``` -->

## 🐳 Containerização e Orquestração

```
┌─────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE                           │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Frontend   │  │   Backend   │  │  Database   │          │
│  │ Container   │  │ Container   │  │ Container   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│         │                  │                  │             │
│  ┌──────▼──────┐  ┌────────▼────────┐ ┌──────▼──────┐       │
│  │ Vite Dev    │  │ Node.js + TSX   │ │ PostgreSQL  │       │
│  │ Port: 3000  │  │ Port: 3001      │ │ Port: 5432  │       │
│  │ Hot Reload  │  │ API Server      │ │ Data Store  │       │
│  └─────────────┘  └─────────────────┘ └─────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Bridge Network                         │    │
│  │         (Inter-container Communication)             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Diretórios

```
teste-software-univas/
├── 📁 backend/                    # API REST Server
│   ├── 📁 src/
│   │   ├── 📁 controllers/        # Business Logic
│   │   ├── 📁 routes/            # API Routes
│   │   ├── 📁 middleware/        # Error Handling
│   │   └── 📄 index.ts           # Server Entry Point
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma      # Database Schema
│   │   └── 📄 seed.ts           # Initial Data
│   ├── 📁 tests/
│   │   ├── 📁 unit/              # Unit Tests
│   │   └── 📁 integration/       # Integration Tests
│   ├── 📄 package.json
│   └── 📄 Dockerfile
│
├── 📁 frontend/                   # React SPA
│   ├── 📁 src/
│   │   ├── 📁 components/        # React Components
│   │   ├── 📁 services/          # API Client
│   │   └── 📄 App.tsx            # Main Component
│   ├── 📁 tests/
│   │   └── 📁 e2e/               # End-to-End Tests
│   ├── 📄 package.json
│   └── 📄 Dockerfile
│
├── 📄 docker-compose.yml          # Container Orchestration
├── 📄 env.example                 # Environment Variables
└── 📄 README.md                   # Project Documentation
```


## 🚀 Pontos de Entrada da Aplicação

```

                                                            
  🌐 Frontend: http://localhost:3000                        
     ├── Dashboard (/)                                      
     ├── Users (/users)                                     
     ├── Tasks (/tasks)                                     
     └── Categories (/categories)                           
                                                             
  🔌 Backend API: http://localhost:3001                      
     ├── Health Check: /health                              
     ├── Users API: /api/users                              
     ├── Tasks API: /api/tasks                              
     └── Categories API: /api/categories                    
                                                             
  🗄️ Database: localhost:5432                               
     ├── Database: teste_software_db                         
     ├── User: postgres                                      
     └── Password: postgres123                               
                                                             
```


Esta arquitetura proporciona:
- **Separação clara de responsabilidades**
- **Escalabilidade horizontal**
- **Facilidade de desenvolvimento**
- **Testabilidade abrangente**
- **Deploy simplificado com containers**
