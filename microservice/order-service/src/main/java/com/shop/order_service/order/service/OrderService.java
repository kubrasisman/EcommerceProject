package com.shop.order_service.order.service;

import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.order.dto.response.OrderDtoResponse;
import com.shop.order_service.order.type.OrderStatus;

import java.util.List;

public interface OrderService {

    OrderDtoResponse placeOrder(CartModel cartModel);

    OrderDtoResponse getOrderByCode(String code);

    List<OrderDtoResponse> getOrdersByCustomerEmail(String email);

    List<OrderDtoResponse> getAllOrders();

    OrderDtoResponse updateOrderStatus(String code, OrderStatus status);
}
