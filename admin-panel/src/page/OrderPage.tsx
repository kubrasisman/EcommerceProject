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
  product: ProductInfo
  quantity: number
  basePrice: number
  totalPrice: number
  canceledAmount: number
  shippedAmount: number
}

interface CustomerInfo {
  id: number
  email: string
  fullName: string
}

interface AddressInfo {
  addressTitle: string
  street: string
  city: string
  country: string
  postalCode: string
  phoneNumber: string
}

interface Order {
  code: string
  totalPrice: number
  owner: CustomerInfo
  creationDate: string
  address: AddressInfo
  paymentMethod: string
  entries: OrderEntry[]
  status: string
}

const STATUS_COLORS: Record<string, string> = {
  READY: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PAID: "bg-blue-100 text-blue-800 border-blue-300",
  PROCESSING: "bg-purple-100 text-purple-800 border-purple-300",
  SHIPPED: "bg-indigo-100 text-indigo-800 border-indigo-300",
  DELIVERED: "bg-green-100 text-green-800 border-green-300",
  CANCELED: "bg-red-100 text-red-800 border-red-300",
  RETURN_REQUESTED: "bg-orange-100 text-orange-800 border-orange-300",
  RETURNED: "bg-gray-100 text-gray-800 border-gray-300",
  REFUNDED: "bg-pink-100 text-pink-800 border-pink-300",
}

const ALL_STATUSES = [
  "READY",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
  "RETURN_REQUESTED",
  "RETURNED",
  "REFUNDED",
]

const OrderPage = () => {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderCodeFilter, setOrderCodeFilter] = useState("")
  const [productCodeFilter, setProductCodeFilter] = useState("")
  const [usernameFilter, setUsernameFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const normalizeOrders = (payload: any): Order[] => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (payload.data && Array.isArray(payload.data)) return payload.data
    if (payload.orders && Array.isArray(payload.orders)) return payload.orders
    if (typeof payload === "object") {
      return Object.values(payload).filter((o) => o && typeof o === "object") as Order[]
    }
    return []
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setError(null)
      setOrders([])
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get("/api/orders")
        console.log("Orders response:", response.data)
        setOrders(normalizeOrders(response.data))
      } catch (err: any) {
        console.error("Failed to fetch orders:", err)
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.")
        } else if (err.response?.status === 403) {
          setError("Access denied. You don't have permission to view orders.")
        } else {
          setError(err.message || "Failed to fetch orders")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [isAuthenticated])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Order code filter
      if (orderCodeFilter) {
        const searchTerm = orderCodeFilter.toLowerCase()
        if (!order.code?.toLowerCase().includes(searchTerm)) return false
      }

      // Username filter
      if (usernameFilter) {
        const searchTerm = usernameFilter.toLowerCase()
        const emailMatch = order.owner?.email?.toLowerCase().includes(searchTerm)
        const nameMatch = order.owner?.fullName?.toLowerCase().includes(searchTerm)
        if (!emailMatch && !nameMatch) return false
      }

      // Product code filter
      if (productCodeFilter) {
        const searchTerm = productCodeFilter.toLowerCase()
        const hasProduct = order.entries?.some((entry) =>
          entry.product?.code?.toString().toLowerCase().includes(searchTerm) ||
          entry.product?.name?.toLowerCase().includes(searchTerm)
        )
        if (!hasProduct) return false
      }

      if (statusFilter && order.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [orders, orderCodeFilter, usernameFilter, productCodeFilter, statusFilter])

  const updateOrderStatus = async (code: string, newStatus: string) => {
    try {
      await api.put(`/api/orders/${code}/status`, null, {
        params: { status: newStatus }
      })
      setOrders((prev) =>
        prev.map((o) => (o.code === code ? { ...o, status: newStatus } : o))
      )
    } catch (err) {
      console.error("Failed to update order status:", err)
      alert("Failed to update order status")
    }
  }

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
    setUsernameFilter("")
    setStatusFilter("")
  }

  const hasActiveFilters = orderCodeFilter || productCodeFilter || usernameFilter || statusFilter

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">View and manage customer orders</p>
        </div>
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-8 text-center">
          <div className="text-amber-600 text-4xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold text-amber-800">Login Required</h3>
          <p className="mt-2 text-amber-600">
            Please login using the button in the top right corner to view orders.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-500 mt-1">View and manage customer orders</p>
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

              {/* Username Filter */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Customer Name / Email
                </Label>
                <Input
                  className="mt-1"
                  placeholder="Search customer..."
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
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

              {/* Status Filter */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Order Status
                </Label>
                <select
                  className="mt-1 w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {ALL_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{filteredOrders.length}</span> of{" "}
                <span className="font-medium text-gray-900">{orders.length}</span> orders
              </div>
            </div>
          </div>
        </div>

        {/* Orders List - Main Content */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading orders...</p>
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
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-500">
                {orders.length === 0 ? "No orders found" : "No orders match your filters"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.code}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.code ? null : order.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-mono text-sm font-medium text-gray-900">
                            {order.code}
                          </div>
                          <div className="text-sm text-gray-500 mt-0.5">
                            {formatDate(order.creationDate)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {order.owner?.fullName || order.owner?.email || "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.owner?.email}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {formatPrice(order.totalPrice)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.entries?.length || 0} items
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800 border-gray-300"
                          }`}
                        >
                          {order.status?.replace("_", " ")}
                        </span>

                        <div className="text-gray-400">
                          {expandedOrder === order.code ? "▲" : "▼"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expanded) */}
                  {expandedOrder === order.code && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                          <div className="space-y-2">
                            {order.entries?.map((entry, idx) => (
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
                                <div className="font-medium text-gray-900">
                                  {formatPrice(entry.totalPrice)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Address & Actions */}
                        <div className="space-y-4">
                          {/* Shipping Address */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                              <div className="font-medium text-gray-900">
                                {order.address?.addressTitle || "Address"}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {order.address?.street}<br />
                                {order.address?.city}, {order.address?.postalCode}<br />
                                {order.address?.country}
                              </div>
                              {order.address?.phoneNumber && (
                                <div className="text-sm text-gray-500 mt-2">
                                  Tel: {order.address.phoneNumber}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Payment</h4>
                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                              <div className="text-sm text-gray-600">
                                Method: <span className="font-medium text-gray-900">
                                  {order.paymentMethod?.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status Update */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                            <div className="flex gap-2 flex-wrap">
                              {["PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"].map((status) => (
                                <Button
                                  key={status}
                                  variant={order.status === status ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.code, status)}
                                  disabled={order.status === status}
                                >
                                  {status}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
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

export default OrderPage
