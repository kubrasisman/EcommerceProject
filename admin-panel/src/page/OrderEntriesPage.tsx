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

interface OrderEntry {
  orderCode: string
  orderDate: string
  customerEmail: string
  customerName: string
  product: ProductInfo
  quantity: number
  basePrice: number
  totalPrice: number
  canceledAmount: number
  shippedAmount: number
}

interface Order {
  code: string
  creationDate: string
  owner: {
    email: string
    fullName: string
  }
  entries: {
    product: ProductInfo
    quantity: number
    basePrice: number
    totalPrice: number
    canceledAmount: number
    shippedAmount: number
  }[]
}

const OrderEntriesPage = () => {
  const { isAuthenticated } = useAuth()
  const [entries, setEntries] = useState<OrderEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderCodeFilter, setOrderCodeFilter] = useState("")
  const [productCodeFilter, setProductCodeFilter] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setError(null)
      setEntries([])
      return
    }

    const fetchOrderEntries = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get("/api/orders")

        // Flatten orders to entries
        const orders: Order[] = Array.isArray(response.data) ? response.data : []
        const flattenedEntries: OrderEntry[] = []

        orders.forEach((order) => {
          if (order.entries && Array.isArray(order.entries)) {
            order.entries.forEach((entry) => {
              flattenedEntries.push({
                orderCode: order.code,
                orderDate: order.creationDate,
                customerEmail: order.owner?.email || "",
                customerName: order.owner?.fullName || "",
                product: entry.product,
                quantity: entry.quantity,
                basePrice: entry.basePrice,
                totalPrice: entry.totalPrice,
                canceledAmount: entry.canceledAmount || 0,
                shippedAmount: entry.shippedAmount || 0,
              })
            })
          }
        })

        setEntries(flattenedEntries)
      } catch (err: any) {
        console.error("Failed to fetch order entries:", err)
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.")
        } else {
          setError(err.message || "Failed to fetch order entries")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrderEntries()
  }, [isAuthenticated])

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Order code filter
      if (orderCodeFilter) {
        const searchTerm = orderCodeFilter.toLowerCase()
        if (!entry.orderCode?.toLowerCase().includes(searchTerm)) return false
      }

      // Product code filter
      if (productCodeFilter) {
        const searchTerm = productCodeFilter.toLowerCase()
        const codeMatch = entry.product?.code?.toString().toLowerCase().includes(searchTerm)
        const nameMatch = entry.product?.name?.toLowerCase().includes(searchTerm)
        if (!codeMatch && !nameMatch) return false
      }

      return true
    })
  }, [entries, orderCodeFilter, productCodeFilter])

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("tr-TR")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price)
  }

  const clearFilters = () => {
    setOrderCodeFilter("")
    setProductCodeFilter("")
  }

  const hasActiveFilters = orderCodeFilter || productCodeFilter

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Entries</h1>
          <p className="text-gray-500 mt-1">View all order line items</p>
        </div>
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-8 text-center">
          <div className="text-amber-600 text-4xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold text-amber-800">Login Required</h3>
          <p className="mt-2 text-amber-600">
            Please login using the button in the top right corner to view order entries.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Entries</h1>
        <p className="text-gray-500 mt-1">View all order line items</p>
      </div>

      <div className="flex gap-6">
        {/* Filters - Left Sidebar */}
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
              {/* Order Code Filter */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Order Code
                </Label>
                <Input
                  className="mt-1"
                  placeholder="Search order code..."
                  value={orderCodeFilter}
                  onChange={(e) => setOrderCodeFilter(e.target.value)}
                />
              </div>

              {/* Product Code Filter */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Product Code / Name
                </Label>
                <Input
                  className="mt-1"
                  placeholder="Search product..."
                  value={productCodeFilter}
                  onChange={(e) => setProductCodeFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{filteredEntries.length}</span> of{" "}
                <span className="font-medium text-gray-900">{entries.length}</span> entries
              </div>
            </div>
          </div>
        </div>

        {/* Entries List - Main Content */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading order entries...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
              <div className="text-red-600 font-medium">Error</div>
              <p className="mt-1 text-red-500">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-500">
                {entries.length === 0 ? "No order entries found" : "No entries match your filters"}
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
                      Order Code
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
                      Shipped
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Canceled
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm font-medium text-gray-900">
                          {entry.orderCode}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(entry.orderDate)}
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
                        <span className="font-semibold text-gray-900">
                          {formatPrice(entry.totalPrice)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {entry.shippedAmount > 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            {entry.shippedAmount}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {entry.canceledAmount > 0 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                            {entry.canceledAmount}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
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

export default OrderEntriesPage