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
  product: ProductInfo
  quantity: number
  basePrice: number
  totalPrice: number
  code: string
}

interface CustomerInfo {
  id: number
  email: string
  fullName: string
}

interface Cart {
  code: string
  totalPrice: number
  owner: CustomerInfo
  entries: CartEntry[]
}

const CartPage = () => {
  const { isAuthenticated } = useAuth()
  const [carts, setCarts] = useState<Cart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartCodeFilter, setCartCodeFilter] = useState("")
  const [usernameFilter, setUsernameFilter] = useState("")
  const [productCodeFilter, setProductCodeFilter] = useState("")
  const [expandedCart, setExpandedCart] = useState<string | null>(null)

  const fetchCarts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get("/api/cart/all")
      const data = Array.isArray(response.data) ? response.data : []
      setCarts(data)
    } catch (err: any) {
      console.error("Failed to fetch carts:", err)
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.")
      } else {
        setError(err.message || "Failed to fetch carts")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setError(null)
      setCarts([])
      return
    }
    fetchCarts()
  }, [isAuthenticated])

  const deleteCart = async (cartCode: string) => {
    if (!confirm("Are you sure you want to delete this cart?")) return
    try {
      await api.delete(`/api/cart/admin/${cartCode}`)
      setCarts((prev) => prev.filter((c) => c.code !== cartCode))
      if (expandedCart === cartCode) setExpandedCart(null)
    } catch (err) {
      console.error("Failed to delete cart:", err)
      alert("Failed to delete cart")
    }
  }

  const deleteEntry = async (cartCode: string, entryCode: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return
    try {
      await api.delete(`/api/cart/admin/${cartCode}/entry/${entryCode}`)
      setCarts((prev) =>
        prev.map((cart) => {
          if (cart.code === cartCode) {
            const updatedEntries = cart.entries.filter((e) => e.code !== entryCode)
            const newTotal = updatedEntries.reduce((sum, e) => sum + e.totalPrice, 0)
            return { ...cart, entries: updatedEntries, totalPrice: newTotal }
          }
          return cart
        })
      )
    } catch (err) {
      console.error("Failed to delete entry:", err)
      alert("Failed to delete entry")
    }
  }

  const filteredCarts = useMemo(() => {
    return carts.filter((cart) => {
      if (cartCodeFilter) {
        const searchTerm = cartCodeFilter.toLowerCase()
        if (!cart.code?.toLowerCase().includes(searchTerm)) return false
      }
      if (usernameFilter) {
        const searchTerm = usernameFilter.toLowerCase()
        const emailMatch = cart.owner?.email?.toLowerCase().includes(searchTerm)
        const nameMatch = cart.owner?.fullName?.toLowerCase().includes(searchTerm)
        if (!emailMatch && !nameMatch) return false
      }
      if (productCodeFilter) {
        const searchTerm = productCodeFilter.toLowerCase()
        const hasProduct = cart.entries?.some((entry) =>
          entry.product?.code?.toString().toLowerCase().includes(searchTerm) ||
          entry.product?.name?.toLowerCase().includes(searchTerm)
        )
        if (!hasProduct) return false
      }
      return true
    })
  }, [carts, cartCodeFilter, usernameFilter, productCodeFilter])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price)
  }

  const clearFilters = () => {
    setCartCodeFilter("")
    setUsernameFilter("")
    setProductCodeFilter("")
  }

  const hasActiveFilters = cartCodeFilter || usernameFilter || productCodeFilter

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cart Management</h1>
          <p className="text-gray-500 mt-1">View all customer shopping carts</p>
        </div>
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-8 text-center">
          <div className="text-amber-600 text-4xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold text-amber-800">Login Required</h3>
          <p className="mt-2 text-amber-600">
            Please login using the button in the top right corner to view carts.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cart Management</h1>
        <p className="text-gray-500 mt-1">View all customer shopping carts</p>
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
                <Label className="text-sm font-medium text-gray-700">Customer Name / Email</Label>
                <Input
                  className="mt-1"
                  placeholder="Search customer..."
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
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
                Showing <span className="font-medium text-gray-900">{filteredCarts.length}</span> of{" "}
                <span className="font-medium text-gray-900">{carts.length}</span> carts
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading carts...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
              <div className="text-red-600 font-medium">Error</div>
              <p className="mt-1 text-red-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : filteredCarts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">🛒</div>
              <p className="text-gray-500">
                {carts.length === 0 ? "No carts found" : "No carts match your filters"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCarts.map((cart) => (
                <div key={cart.code} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedCart(expandedCart === cart.code ? null : cart.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          🛒
                        </div>
                        <div>
                          <div className="font-mono text-sm font-medium text-gray-900">
                            {cart.code?.substring(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-500">{cart.entries?.length || 0} items</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {cart.owner?.fullName || cart.owner?.email || "-"}
                          </div>
                          <div className="text-xs text-gray-500">{cart.owner?.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{formatPrice(cart.totalPrice)}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteCart(cart.code)
                          }}
                        >
                          Delete
                        </Button>
                        <div className="text-gray-400">{expandedCart === cart.code ? "▲" : "▼"}</div>
                      </div>
                    </div>
                  </div>

                  {expandedCart === cart.code && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-3">Cart Items</h4>
                      {cart.entries && cart.entries.length > 0 ? (
                        <div className="space-y-2">
                          {cart.entries.map((entry, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                            >
                              {entry.product?.imageUrl ? (
                                <img
                                  src={entry.product.imageUrl}
                                  alt={entry.product.name}
                                  className="w-14 h-14 object-cover rounded-md"
                                />
                              ) : (
                                <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                  📦
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                  {entry.product?.name || "Unknown Product"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Code: {entry.product?.code} | {entry.product?.brand}
                                </div>
                                <div className="text-sm text-gray-700 mt-1">
                                  {entry.quantity} x {formatPrice(entry.basePrice)}
                                </div>
                              </div>
                              <div className="font-medium text-gray-900 mr-4">
                                {formatPrice(entry.totalPrice)}
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteEntry(cart.code, entry.code)}
                              >
                                Delete
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center py-4">Cart is empty</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartPage