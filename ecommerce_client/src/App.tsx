import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from './components/common/Loader'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAppDispatch, useAppSelector } from './store/store'
import { fetchCart } from './store/slices/cartSlice'

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
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector((state) => state.auth)

  // Load cart when user is authenticated
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCart())
    }
  }, [accessToken, dispatch])

  return (
    <Suspense fallback={<Loader fullScreen text="Yükleniyor..." />}>
      <Routes>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="/search" element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} /> {/* id is product code */}
        
        {/* Auth Routes - Only accessible when NOT logged in */}
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <ProtectedRoute requireAuth={false}>
              <RegisterPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Routes - Require authentication */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <CartEntry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order/:id" 
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-summary/:id" 
          element={
            <ProtectedRoute>
              <OrderSummaryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Suspense>
  )
}

export default App