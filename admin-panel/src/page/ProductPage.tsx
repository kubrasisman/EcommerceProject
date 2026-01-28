import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"
import { CreateProductModal, type Product } from "@/components/modal/CreateProductModal"

interface Category {
  code: number
  name: string
  level?: number
  children?: Category[]
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Normalize various possible API response shapes into an array of Product
  const normalizeProducts = (payload: any): Product[] => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (payload.data && Array.isArray(payload.data)) return payload.data
    if (payload.products && Array.isArray(payload.products)) return payload.products
    // If it's an object keyed by id, return its values
    if (typeof payload === "object") {
      return Object.values(payload).filter((p) => p && typeof p === "object") as Product[]
    }
    return []
  }

  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:8888/api/products")
    setProducts(normalizeProducts(response.data))
  }

  const fetchCategories = async () => {
    const response = await axios.get("http://localhost:8888/api/categories/hierarchy")
    setCategories(response.data)
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const refreshData = () => {
    fetchProducts()
    fetchCategories()
  }

  const deleteProduct = (id: number | null | undefined) => {
    axios
      .delete(`http://localhost:8888/api/products/remove/${id}`)
      .then((response) => {
        if (response.status === 200) {
          refreshData()
        }
      })
  }

  const handleSubmit = (product: Product) => {
    if (product.id) {
      // Güncelleme
      axios
        .post("http://localhost:8888/api/products/update", product)
        .then((response) => {
          if (response.status === 200) {
            refreshData()
          }
        })
    } else {
      // Yeni kayıt
      axios
        .post("http://localhost:8888/api/products/save", product)
        .then((response) => {
          if (response.status === 200) {
            refreshData()
          }
        })
    }
  }

  // compute productsList once to use in JSX rendering
  const productsList: Product[] = Array.isArray(products) ? products : (Object.values(products as any) as Product[])

  return (
    <div className="flex w-screen flex-col ps-10 pe-10 pt-6 pb-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Product Page</h1>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            setSelectedProduct(null)
            setModalOpen(true)
          }}
        >
          Create Product
        </Button>
      </div>

      <div className="mt-10">
        <table className="w-full table-auto border-collapse border border-slate-400">
          <thead>
            <tr>
              <th className="border border-slate-300 px-4 py-2">ID</th>
              <th className="border border-slate-300 px-4 py-2">Code</th>
              <th className="border border-slate-300 px-4 py-2">Name</th>
              <th className="border border-slate-300 px-4 py-2">Brand</th>
              <th className="border border-slate-300 px-4 py-2">Price</th>
              <th className="border border-slate-300 px-4 py-2">Description</th>
              <th className="border border-slate-300 px-4 py-2">Image</th>
              <th className="border border-slate-300 px-4 py-2">Categories</th>
              <th className="border border-slate-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((product) => (
              <tr key={product.id}>
                <td className="border border-slate-300 px-4 py-2">{product.id}</td>
                <td className="border border-slate-300 px-4 py-2">{product.code}</td>
                <td className="border border-slate-300 px-4 py-2">{product.name}</td>
                <td className="border border-slate-300 px-4 py-2">{product.brand}</td>
                <td className="border border-slate-300 px-4 py-2">{product.price}</td>
                <td className="border border-slate-300 px-4 py-2">{product.description}</td>
                <td className="border border-slate-300 px-4 py-2 text-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {product.categoryCodes && product.categoryCodes.length > 0 ? (
                      product.categoryCodes.map((cat: any) => (
                        <span
                          key={typeof cat === 'number' ? cat : cat.code}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {typeof cat === 'number' ? cat : cat.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="border border-slate-300 px-4 py-2 text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Sil
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ms-2"
                    onClick={() => {
                      setSelectedProduct(product)
                      setModalOpen(true)
                    }}
                  >
                    Düzenle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateProductModal
        open={modalOpen}
        setOpen={setModalOpen}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default ProductPage
