# ShopHub - Modern E-Commerce Platform

A modern, fully-featured e-commerce platform built with React, TypeScript, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design using Shadcn/UI components and Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Type Safety**: Full TypeScript support for type-safe development
- **Authentication**: User registration and login system
- **Product Management**: Browse products, search, filter, and view details
- **Shopping Cart**: Add to cart, update quantities, and manage items
- **Checkout**: Complete checkout flow with shipping and payment information
- **Order Management**: View order history and track orders
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Code Splitting**: Lazy loading for optimal performance
- **Mock Data**: Built-in mock data for development without backend

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Shadcn/UI** - UI components
- **Axios** - HTTP client
- **Vite** - Build tool
- **Lucide React** - Icons

## 📦 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable common components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartItemComponent.tsx
│   │   ├── Loader.tsx
│   │   ├── EmptyState.tsx
│   │   └── Layout.tsx
│   ├── ui/              # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── cart/            # Cart-specific components
│   └── checkout/        # Checkout-specific components
├── page/                # Page components
│   ├── HomePage.tsx
│   ├── ProductListingPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── OrdersPage.tsx
│   ├── OrderDetailPage.tsx
│   ├── OrderSummaryPage.tsx
│   └── ProfilePage.tsx
├── store/               # Redux store
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── productSlice.ts
│   │   ├── cartSlice.ts
│   │   └── orderSlice.ts
│   └── store.ts
├── services/            # API services
│   ├── authService.ts
│   ├── productService.ts
│   ├── cartService.ts
│   └── orderService.ts
├── types/               # TypeScript types
│   ├── user.types.ts
│   ├── product.types.ts
│   ├── cart.types.ts
│   ├── order.types.ts
│   └── common.types.ts
├── lib/                 # Utilities and helpers
│   ├── api.ts
│   ├── utils.ts
│   ├── mockData.ts
│   ├── mockInterceptor.ts
│   ├── constants.ts
│   └── helpers.ts
└── App.tsx              # Main app component
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn installed

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce_client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_USE_MOCK=true
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🎨 Key Features Explained

### Authentication
- User registration and login
- JWT token-based authentication
- Protected routes for authenticated users
- Profile management

### Product Management
- Browse products with pagination
- Search and filter functionality
- Product categories
- Product details with image gallery
- Related products
- Rating and reviews display
- Customer review system with ratings
- Review submission form
- Rating distribution chart
- Helpful review voting

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time price calculation
- Tax and shipping calculation
- Free shipping threshold
- Mini cart drawer

### Checkout
- Multi-step checkout process
- Shipping address form
- Payment method selection
- Order summary
- Order confirmation

### Order Management
- Order history
- Order details
- Order tracking
- Order status updates

### UI/UX Features
- Responsive design
- Loading states
- Error handling
- Toast notifications
- Skeleton loaders
- Empty states
- Form validation

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Mock Data

The application includes a comprehensive mock data system for development:
- Mock products with images
- Mock cart operations
- Mock order creation
- Mock authentication

To disable mock data and use a real API, set `VITE_USE_MOCK=false` in your `.env` file.

## 🚀 Deployment

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## 📝 Environment Variables

- `VITE_API_URL` - Backend API URL (default: `http://localhost:8080/api/v1`)
- `VITE_USE_MOCK` - Enable/disable mock data (default: `true`)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- [Lucide Icons](https://lucide.dev/) for the icon library

---

Built with ❤️ using React and TypeScript
