package com.shop.order_service.order.type;

public enum OrderStatus {
    READY,
    PAID,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELED,
    RETURN_REQUESTED,
    RETURNED,
    REFUNDED;
}
