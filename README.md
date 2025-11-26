# E-Commerce Platform

A modern, scalable, and fully-featured e-commerce platform built with a microservices architecture. Includes frontend applications, multiple backend microservices, and a robust database layer.

## Overview

Project is a production-ready e-commerce solution featuring:
- **Microservices Architecture** - Scalable backend with Spring Cloud
- **Modern Frontend** - React with TypeScript, Redux Toolkit, and Tailwind CSS
- **Admin Dashboard** - Comprehensive management interface
- **Real-time Updates** - Redis-powered session management
- **Secure Authentication** - JWT-based authentication with Spring Security
- **API Gateway** - Route management and request filtering

## Project Structure

```
ecommerce/
├── admin-panel/                 # Admin management dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── page/
│   │   └── App.tsx
│   └── package.json
│
├── ecommerce_client/            # Customer-facing e-commerce app
│   ├── src/
│   │   ├── components/
│   │   ├── page/
│   │   ├── store/              # Redux state management
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── lib/
│   └── package.json
│
├── microservice/                # Backend microservices
│   ├── customer-service/       # User & authentication management
│   ├── product-service/        # Product & category management
│   ├── order-service/          # Order & cart management
│   ├── media-service/          # File/media handling
│   ├── gateway-service/        # API Gateway & routing
│   ├── eureka-service/         # Service discovery
│   └── pom.xml
│
├── supabase/
│   └── migrations/             # Database migrations
│
└── README.md
```

## Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS 4** - Styling
- **Shadcn/UI** - Component library
- **Axios** - HTTP client
- **Vite** - Build tool
- **Lucide React** - Icons

### Backend
- **Spring Boot 3.5.6** - Application framework
- **Spring Cloud 2025.0.0** - Microservices framework
- **Spring Data JPA** - ORM & database access
- **Spring Security** - Authentication & authorization
- **Eureka** - Service discovery
- **OpenFeign** - Declarative HTTP client
- **MapStruct 1.5.5** - Object mapping
- **Redis** - Session & caching
- **MySQL** - Primary database
- **JWT (JJWT)** - Token-based authentication
- **Lombok** - Boilerplate reduction


## Core Services

  ### Customer Service
  - User registration and authentication
  - Address management
  - Profile management
  - JWT token handling
  - Redis caching for sessions


  ### Product Service
  - Product catalog management
  - Category management
  - Product filtering and search
  - Product details and metadata


  ### Order Service
  - Shopping cart management
  - Order creation and management
  - Order status tracking
  - Payment processing
  - Cart session management with Redis


  **Key Features:**
  - Cart-to-Order conversion using MapStruct
  - Session-based cart persistence via Redis
  - Real-time cart total calculation
  - User-specific order retrieval
  - Order code generation (ORD-XXXXXXXX)

  ### Media Service
  - File upload and storage
  - Media URL resolution
  - Local and cloud storage strategies

  ### Gateway Service
  - Request routing to microservices
  - JWT validation and authentication
  - Cross-cutting concerns (CORS, logging)
  - Service discovery integration

  ### Eureka Service
  - Service discovery and registration
  - Load balancing
  - Health checking
  - Dynamic service management

 
  ### Admin Panel
  Administrative dashboard for:
  - Product management (CRUD)
  - Category management
  - Order management
  - User management
  - Analytics and reporting


## Getting Started

  ### Prerequisites
  - **Frontend:**
    - Node.js 18+ and npm/yarn

    - **Backend:**
      - Java 21
      - Maven 3.8+
      - Mysql


### Installation
#### Frontend Setup

1. **E-Commerce Client:**
```bash
cd ecommerce_client
npm install
npm run dev
```
Access at: `http://localhost:5173`

2. **Admin Panel:**
```bash
cd admin-panel
npm install
npm run dev
```
Access at: `http://localhost:5174`

#### Backend Setup

1. **Start Eureka Service (required first):**
```bash
cd microservice/eureka-service
mvn spring-boot:run
```
Access Eureka Dashboard: `http://localhost:8761`

2. **Start Customer Service:**
```bash
cd microservice/customer-service
mvn spring-boot:run
```

3. **Start Product Service:**
```bash
cd microservice/product-service
mvn spring-boot:run
```

4. **Start Order Service:**
```bash
cd microservice/order-service
mvn spring-boot:run
```

5. **Start Media Service:**
```bash
cd microservice/media-service
mvn spring-boot:run
```

6. **Start Gateway Service (last):**
```bash
cd microservice/gateway-service
mvn spring-boot:run
```
Access API Gateway: `http://localhost:8080`

### Environment Variables
Configure database, Redis, and service ports in each microservice's `application.properties`


## Microservices Communication

Services communicate via:
1. **Eureka** - Service discovery
2. **OpenFeign** - Declarative HTTP client

Example Feign client:
```java
@FeignClient(name = "product-service")
public interface ProductServiceClient {
    @GetMapping("/products/{id}")
    ProductDtoResponse getProduct(@PathVariable Long id);
}
```

## Caching Strategy

**Redis is used for:**
- User session storage (24-hour TTL)
- Cart data caching
- Product catalog caching
- User authentication state


## Code Standards

  ### Frontend
  - TypeScript for type safety
  - ESLint for linting
  - Functional components with React Hooks
  - Redux Toolkit for state management
  - Shadcn/UI component patterns

  ### Backend
  - Spring Boot best practices
  - MapStruct for object mapping
  - Lombok for boilerplate reduction
  - REST API conventions
  - Proper exception handling
  - Transaction management with @Transactional


  ## Security Considerations

  - JWT token expiration
  - Password hashing with Spring Security
  - CORS configuration
  - SQL injection prevention via JPA
  - XSS protection
  - CSRF tokens
  - Rate limiting ready
