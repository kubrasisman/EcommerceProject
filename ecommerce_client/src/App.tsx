import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from './components/common/Loader'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./page/HomePage'))
const ProductListingPage = lazy(() => import('./page/ProductListingPage'))
const ProductDetailPage = lazy(() => import('./page/ProductDetailPage'))
const LoginPage = lazy(() => import('./page/LoginPage'))
const RegisterPage = lazy(() => import('./page/RegisterPage'))
const CartEntry = lazy(() => import('./components/cart/CartEntry'))
const Checkout = lazy(() => import('./components/checkout/Checkout'))
const OrdersPage = lazy(() => import('./page/OrdersPage'))
const OrderDetailPage = lazy(() => import('./page/OrderDetailPage'))
const OrderSummaryPage = lazy(() => import('./page/OrderSummaryPage'))
const ProfilePage = lazy(() => import('./page/ProfilePage'))

function App() {
  return (
    <Suspense fallback={<Loader fullScreen text="Loading..." />}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/search" element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartEntry />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/order-summary/:id" element={<OrderSummaryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Suspense>
  )
}

export default App