import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"
import { CreateProductModal, type Product } from "@/components/modal/CreateProductModal"

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:8888/api/products")
      setProducts(response.data)
    }
    fetchProducts()
  }, [])

  const deleteProduct = (id: number | null | undefined) => {
    axios
      .delete(`http://localhost:8888/api/products/remove/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setProducts((prev) => prev.filter((p) => p.id !== id))
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
            setProducts((prev) =>
              prev.map((p) =>
                p.id === product.id ? response.data : p
              )
            )
          }
        })
    } else {
      // Yeni kayıt
      axios
        .post("http://localhost:8888/api/products/save", product)
        .then((response) => {
          if (response.status === 200) {
            setProducts((prev) => [...prev, response.data])
          }
        })
    }
  }

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
              <th className="border border-slate-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
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
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default ProductPage
