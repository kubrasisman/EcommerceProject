# E-Commerce Platform

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern, scalable, and fully-featured e-commerce platform built with a microservices architecture. Includes frontend applications, multiple backend microservices, and a robust database layer.

## Overview

Project is a production-ready e-commerce solution featuring:
- **Microservices Architecture** - Scalable backend with Spring Cloud
- **Modern Frontend** - React with TypeScript, Redux Toolkit, and Tailwind CSS
- **Admin Dashboard** - Comprehensive management interface
- **Real-time Updates** - Redis-powered session management
- **Secure Authentication** - JWT-based authentication with Spring Security
- **API Gateway** - Route management and request filtering
- **Full-text Search** - Elasticsearch-powered product search

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
│   ├── search-service/         # Elasticsearch search
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
- **Elasticsearch** - Full-text search
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
- Cart-to-Order conversion using MapStruct
- Session-based cart persistence via Redis
- Real-time cart total calculation
- User-specific order retrieval
- Order code generation (ORD-XXXXXXXX)

### Media Service
- File upload and storage
- Media URL resolution
- Local and cloud storage strategies

### Search Service
- Elasticsearch integration
- Full-text product search
- Auto-complete suggestions
- Product indexing from Product Service
- Port: 9020

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

## API Endpoints

| Service | Port | Endpoints | Auth |
|---------|------|-----------|------|
| Gateway | 8888 | /* (proxy) | Mixed |
| Customer | 8082 | /api/auth, /api/customers | Mixed |
| Product | 8090 | /api/products, /api/categories | Public |
| Order | 8081 | /api/cart, /api/orders | Protected |
| Media | 8055 | /api/mediaservice | Protected |
| Search | 9020 | /api/search | Public |
| Eureka | 8761 | / (dashboard) | - |

## Getting Started

### Prerequisites

**Frontend:**
- Node.js 18+ and npm/yarn

**Backend:**
- Java 21
- Maven 3.8+
- MySQL
- Redis
- Elasticsearch (optional, for search)

### Quick Start with Docker

#### Prerequisites
- Docker & Docker Compose

#### Start Infrastructure
```bash
cd microservice/docker
docker-compose up -d
```

This starts:
- MySQL (3306)
- Redis (6379)
- Elasticsearch (9200)

### Manual Installation

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

6. **Start Search Service (optional):**
```bash
cd microservice/search-service
mvn spring-boot:run
```

7. **Start Gateway Service (last):**
```bash
cd microservice/gateway-service
mvn spring-boot:run
```
Access API Gateway: `http://localhost:8888`

## Environment Variables

### Backend (application.properties)


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

## Troubleshooting

### Common Issues

**Eureka: Service not registered**
- Check if Eureka Service is running first
- Verify `eureka.client.service-url.defaultZone` in application.properties

**Redis: Connection refused**
- Ensure Redis is running: `redis-cli ping`
- Check host/port configuration

**JWT: Invalid signature**
- Ensure all services use the same `jwt.secret`
- Check token expiration

**Feign: 404 Not Found**
- Ensure target service is registered with Eureka
- Check service name in @FeignClient annotation

**Elasticsearch: Connection error**
- Verify Elasticsearch is running on port 9200
- Check cluster health: `curl http://localhost:9200/_cluster/health`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Backend: Follow Spring Boot conventions
- Frontend: ESLint + Prettier
- Commits: Use conventional commit messages