import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState, useMemo } from "react"
import { api, useAuth } from "@/context/AuthContext"

interface ProductInfo {
  code: string
  name: string
  title: string
  brand: string
  price: number
  imageUrl: string
}

interface CartEntry {
  cartCode: string
  customerEmail: string
  customerName: string
  product: ProductInfo
  quantity: number
  basePrice: number
  totalPrice: number
  code: string
}

interface Cart {
  code: string
  owner: {
    email: string
    fullName: string
  }
  entries: {
    product: ProductInfo
    quantity: number
    basePrice: number
    totalPrice: number
    code: string
  }[]
}

const CartEntriesPage = () => {
  const { isAuthenticated } = useAuth()
  const [entries, setEntries] = useState<CartEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartCodeFilter, setCartCodeFilter] = useState("")
  const [productCodeFilter, setProductCodeFilter] = useState("")

  const fetchCartEntries = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get("/api/cart/all")

      const carts: Cart[] = Array.isArray(response.data) ? response.data : []
      const flattenedEntries: CartEntry[] = []

      carts.forEach((cart) => {
        if (cart.entries && Array.isArray(cart.entries)) {
          cart.entries.forEach((entry) => {
            flattenedEntries.push({
              cartCode: cart.code,
              customerEmail: cart.owner?.email || "",
              customerName: cart.owner?.fullName || "",
              product: entry.product,
              quantity: entry.quantity,
              basePrice: entry.basePrice,
              totalPrice: entry.totalPrice,
              code: entry.code,
            })
          })
        }
      })

      setEntries(flattenedEntries)
    } catch (err: any) {
      console.error("Failed to fetch cart entries:", err)
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.")
      } else {
        setError(err.message || "Failed to fetch cart entries")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setError(null)
      setEntries([])
      return
    }
    fetchCartEntries()
  }, [isAuthenticated])

  const deleteEntry = async (cartCode: string, entryCode: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return
    try {
      await api.delete(`/api/cart/admin/${cartCode}/entry/${entryCode}`)
      setEntries((prev) => prev.filter((e) => !(e.cartCode === cartCode && e.code === entryCode)))
    } catch (err) {
      console.error("Failed to delete entry:", err)
      alert("Failed to delete entry")
    }
  }

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (cartCodeFilter) {
        const searchTerm = cartCodeFilter.toLowerCase()
        if (!entry.cartCode?.toLowerCase().includes(searchTerm)) return false
      }
      if (productCodeFilter) {
        const searchTerm = productCodeFilter.toLowerCase()
        const codeMatch = entry.product?.code?.toString().toLowerCase().includes(searchTerm)
        const nameMatch = entry.product?.name?.toLowerCase().includes(searchTerm)
        if (!codeMatch && !nameMatch) return false
      }
      return true
    })
  }, [entries, cartCodeFilter, productCodeFilter])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price)
  }

  const clearFilters = () => {
    setCartCodeFilter("")
    setProductCodeFilter("")
  }

  const hasActiveFilters = cartCodeFilter || productCodeFilter

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cart Entries</h1>
          <p className="text-gray-500 mt-1">View all cart line items</p>
        </div>
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-8 text-center">
          <div className="text-amber-600 text-4xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold text-amber-800">Login Required</h3>
          <p className="mt-2 text-amber-600">
            Please login using the button in the top right corner to view cart entries.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cart Entries</h1>
        <p className="text-gray-500 mt-1">View all cart line items</p>
      </div>

      <div className="flex gap-6">
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  Clear All
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Cart Code</Label>
                <Input
                  className="mt-1"
                  placeholder="Search cart code..."
                  value={cartCodeFilter}
                  onChange={(e) => setCartCodeFilter(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Product Code / Name</Label>
                <Input
                  className="mt-1"
                  placeholder="Search product..."
                  value={productCodeFilter}
                  onChange={(e) => setProductCodeFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{filteredEntries.length}</span> of{" "}
                <span className="font-medium text-gray-900">{entries.length}</span> entries
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading cart entries...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
              <div className="text-red-600 font-medium">Error</div>
              <p className="mt-1 text-red-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">🛒</div>
              <p className="text-gray-500">
                {entries.length === 0 ? "No cart entries found" : "No entries match your filters"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Cart Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm font-medium text-gray-900">
                          {entry.cartCode?.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {entry.product?.imageUrl ? (
                            <img
                              src={entry.product.imageUrl}
                              alt={entry.product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                              📦
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {entry.product?.name || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {entry.product?.code} | {entry.product?.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{entry.customerName || "-"}</div>
                        <div className="text-xs text-gray-500">{entry.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-medium text-gray-900">{entry.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {formatPrice(entry.basePrice)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-gray-900">{formatPrice(entry.totalPrice)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteEntry(entry.cartCode, entry.code)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartEntriesPage