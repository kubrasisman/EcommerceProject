import AdminLayout from "./components/Layout";
import CategoryPage from "./page/CategoryPage"
import ProductPage from "./page/ProductPage"
import BannerPage from "./page/BannerPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<CategoryPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/banners" element={<BannerPage />} />
        </Route>
        <Route path="*" element={<h2>Sayfa bulunamadı 😢</h2>} />
      </Routes>
    </Router>
  )
}

export default App