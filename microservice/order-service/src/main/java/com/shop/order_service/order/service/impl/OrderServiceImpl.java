package com.shop.order_service.order.service.impl;

import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.service.CartService;
import com.shop.order_service.order.dto.OrderData;
import com.shop.order_service.order.model.OrderEntryModel;
import com.shop.order_service.order.model.OrderModel;
import com.shop.order_service.order.populator.OrderPopulator;
import com.shop.order_service.order.repository.OrderRepository;
import com.shop.order_service.order.service.OrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderPopulator orderPopulator;
    private final CartService cartService;

    @Override
    @Transactional
    public OrderData placeOrder(HttpSession session) {
        CartModel cart = cartService.getCart(session);

        if (cart == null || cart.getEntries().isEmpty()) {
            throw new IllegalStateException("Cart is empty, cannot place order");
        }

        OrderModel order = new OrderModel();
        order.setCode(generateOrderCode());
        order.setCustomerEmail(cart.getCustomerEmail());
        order.setTotalPrice(cart.getTotalPrice());
        order.setAddress(cart.getAddress());
        order.setStatus("PENDING");

        List<OrderEntryModel> orderEntries = cart.getEntries().stream()
                .map(cartEntry -> {
                    OrderEntryModel orderEntry = new OrderEntryModel();
                    orderEntry.setProductId(cartEntry.getProductId());
                    orderEntry.setProductName(cartEntry.getProductName());
                    orderEntry.setPrice(cartEntry.getPrice());
                    orderEntry.setQuantity(cartEntry.getQuantity());
                    orderEntry.setTotalPrice(cartEntry.getTotalPrice());
                    orderEntry.setOrder(order);
                    return orderEntry;
                })
                .collect(Collectors.toList());

        order.setEntries(orderEntries);

        OrderModel savedOrder = orderRepository.save(order);

        session.invalidate();

        return orderPopulator.toData(savedOrder);
    }

    @Override
    public OrderData getOrderByCode(String code) {
        OrderModel order = orderRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with code: " + code));
        return orderPopulator.toData(order);
    }

    @Override
    public List<OrderData> getOrdersByCustomerEmail(String email) {
        List<OrderModel> orders = orderRepository.findAll().stream()
                .filter(order -> order.getCustomerEmail().equals(email))
                .collect(Collectors.toList());
        return orderPopulator.toDataList(orders);
    }

    @Override
    public List<OrderData> getAllOrders() {
        return orderPopulator.toDataList(orderRepository.findAll());
    }

    @Override
    @Transactional
    public OrderData updateOrderStatus(String code, String status) {
        OrderModel order = orderRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with code: " + code));

        order.setStatus(status);
        OrderModel updatedOrder = orderRepository.save(order);

        return orderPopulator.toData(updatedOrder);
    }

    private String generateOrderCode() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
