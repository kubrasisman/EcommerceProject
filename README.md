# ShopHub - Full-Stack E-Commerce Platform

A modern, scalable, and fully-featured e-commerce platform built with a microservices architecture. Includes frontend applications, multiple backend microservices, and a robust database layer.

## Overview

ShopHub is a production-ready e-commerce solution featuring:
- **Microservices Architecture** - Scalable backend with Spring Cloud
- **Modern Frontend** - React with TypeScript, Redux Toolkit, and Tailwind CSS
- **Admin Dashboard** - Comprehensive management interface
- **Real-time Updates** - Redis-powered session management
- **Secure Authentication** - JWT-based authentication with Spring Security
- **API Gateway** - Route management and request filtering

## Project Structure

```
ShopHub/
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
- **PostgreSQL** - Primary database
- **Supabase** - Database hosting & auth
- **JWT (JJWT)** - Token-based authentication
- **Lombok** - Boilerplate reduction
- **Reflections** - Classpath scanning

### Additional Tools
- **Maven** - Build automation
- **Docker** - Containerization
- **ESLint** - Code linting
- **Springdoc OpenAPI** - API documentation

## Core Services

### Customer Service
- User registration and authentication
- Address management
- Profile management
- JWT token handling
- Redis caching for sessions

**Endpoints:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/customers/{id}` - Get customer profile
- `POST /api/v1/addresses` - Add shipping address

### Product Service
- Product catalog management
- Category management
- Product filtering and search
- Product details and metadata

**Endpoints:**
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/categories` - List categories
- `POST /api/v1/products` - Create product (admin)

### Order Service
- Shopping cart management
- Order creation and management
- Order status tracking
- Payment processing
- Cart session management with Redis

**Endpoints:**
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/entries` - Add to cart
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/{code}` - Get order details
- `GET /api/v1/orders/user` - Get user orders

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

## Frontend Applications

### E-Commerce Client
Modern customer-facing application with:
- Product browsing and search
- Shopping cart management
- Checkout flow
- Order tracking
- User authentication
- Responsive design
- Mock data support for development

**Pages:**
- Home page
- Product listing with filters
- Product details with reviews
- Shopping cart
- Checkout process
- Order history
- User profile
- Login/Registration

**State Management:**
- Redux slices: auth, product, cart, order
- Centralized state with Redux Toolkit
- Async thunk actions for API calls

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
  - PostgreSQL 12+

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

#### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8080/api/v1
VITE_USE_MOCK=true
```

#### Backend (application.properties)
Configure database, Redis, and service ports in each microservice's `application.properties`

## Database Schema

The application uses Supabase PostgreSQL with the following key tables:
- `users` - User accounts and authentication
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `order_entries` - Individual items in orders
- `carts` - Shopping cart storage
- `cart_entries` - Items in shopping carts
- `addresses` - Shipping addresses
- `media` - File/media storage metadata

Migrations are stored in `supabase/migrations/`

## API Documentation

### Authentication
All authenticated endpoints require JWT token:
```header
Authorization: Bearer <your-jwt-token>
```

### Base URL
```
http://localhost:8080/api/v1
```

### Key Endpoints

**Auth:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh token

**Products:**
- `GET /products` - List products
- `GET /products/{id}` - Product details
- `GET /categories` - List categories

**Cart:**
- `GET /cart` - Get user's cart
- `POST /cart/entries` - Add item to cart
- `PUT /cart/entries/{id}` - Update quantity
- `DELETE /cart/entries/{id}` - Remove from cart

**Orders:**
- `POST /orders` - Create order
- `GET /orders/{code}` - Get order by code
- `GET /orders/user` - Get user's orders
- `GET /orders` - Get all orders (admin)

**Customers:**
- `GET /customers/{id}` - Get customer profile
- `PUT /customers/{id}` - Update profile
- `POST /addresses` - Add address

## Key Features

### Shopping Experience
- Browse unlimited products
- Search and filter by category
- Detailed product information
- User reviews and ratings
- Add to cart functionality
- Real-time cart updates
- Secure checkout process
- Multiple payment options

### Order Management
- Order creation with automatic code generation
- Order tracking by code
- User-specific order history
- Order status management
- Order entry details
- Shipping address association

### Admin Features
- Product management (create, update, delete)
- Category management
- Order monitoring
- User management
- Analytics and reporting
- Bulk operations

### Security
- JWT-based authentication
- Spring Security integration
- Password encryption
- Secure session management
- CORS protection
- Input validation
- Role-based access control

### Performance
- Redis caching
- Session management
- Database indexing
- API response optimization
- Lazy loading on frontend
- Code splitting

## Development

### Running Tests
```bash
# Frontend tests
cd ecommerce_client
npm run test

# Backend tests
cd microservice/<service-name>
mvn test
```

### Building for Production

**Frontend:**
```bash
npm run build
# Output: dist/
```

**Backend:**
```bash
mvn clean package
# Output: target/*.jar
```

### Code Quality

**ESLint (Frontend):**
```bash
npm run lint
```

**Formatting:**
- Frontend: Prettier (via ESLint)
- Backend: Google Java Format

## Microservices Communication

Services communicate via:
1. **Eureka** - Service discovery
2. **OpenFeign** - Declarative HTTP client
3. **RestTemplate** - Programmatic HTTP client

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

## Deployment

### Docker Deployment

Build microservices:
```bash
cd microservice/<service-name>
docker build -t shop/<service-name>:1.0 .
```

Start with Docker Compose:
```bash
docker-compose -f microservice/docker/docker-compose.yml up
```

### Cloud Deployment
- Frontend: Vercel, Netlify, AWS S3 + CloudFront
- Backend: AWS ECS, Google Cloud Run, Azure Container Instances
- Database: Supabase (managed PostgreSQL)

## Project Statistics

- **Frontend Components:** 30+
- **Redux Slices:** 4
- **API Services:** 6
- **Microservices:** 6
- **Database Tables:** 10+
- **Endpoints:** 40+
- **Lines of Code:** 15,000+

## Troubleshooting

### Service Discovery Issues
1. Ensure Eureka service is running
2. Check Eureka dashboard at `http://localhost:8761`
3. Verify service registration in logs

### Database Connection
1. Verify PostgreSQL is running
2. Check database credentials in `application.properties`
3. Ensure migrations have run successfully

### API Gateway Not Routing
1. Check gateway configuration
2. Verify services are registered in Eureka
3. Review JWT filter configuration

### Redux Store Issues
1. Check Redux DevTools browser extension
2. Verify slice initialization
3. Ensure thunks are properly configured

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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

## Performance Optimization

- Frontend code splitting
- Redux selector memoization
- Database query optimization
- API response caching
- Redis session management
- Connection pooling
- Lazy component loading

## Security Considerations

- JWT token expiration
- Password hashing with Spring Security
- CORS configuration
- SQL injection prevention via JPA
- XSS protection
- CSRF tokens
- Rate limiting ready

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check existing issues on GitHub
2. Create a detailed bug report
3. Include environment details
4. Provide reproduction steps

## Acknowledgments

- Spring Boot and Spring Cloud teams
- React community
- Tailwind CSS
- Shadcn/UI
- Supabase
- All open-source contributors

---

Built with modern technologies for scalability, maintainability, and performance.
