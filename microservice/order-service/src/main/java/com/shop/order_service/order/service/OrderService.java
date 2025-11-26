package com.shop.order_service.order.service;

import com.shop.order_service.order.dto.OrderData;
import jakarta.servlet.http.HttpSession;

import java.util.List;

public interface OrderService {

    OrderData placeOrder(HttpSession session);

    OrderData getOrderByCode(String code);

    List<OrderData> getOrdersByCustomerEmail(String email);

    List<OrderData> getAllOrders();

    OrderData updateOrderStatus(String code, String status);
}
