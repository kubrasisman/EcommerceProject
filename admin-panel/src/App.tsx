import AdminLayout from "./components/Layout";
import CategoryPage from "./page/CategoryPage"
import ProductPage from "./page/ProductPage"
import BannerPage from "./page/BannerPage"
import OrderPage from "./page/OrderPage"
import OrderEntriesPage from "./page/OrderEntriesPage"
import CartPage from "./page/CartPage"
import CartEntriesPage from "./page/CartEntriesPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<CategoryPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/banners" element={<BannerPage />} />
            {/* Order Management */}
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/order-entries" element={<OrderEntriesPage />} />
            {/* Cart Management */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/cart-entries" element={<CartEntriesPage />} />
          </Route>
          <Route path="*" element={<h2>Sayfa bulunamadi</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App