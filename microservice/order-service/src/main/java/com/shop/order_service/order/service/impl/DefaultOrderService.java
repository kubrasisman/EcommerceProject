package com.shop.order_service.order.service.impl;

import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.service.CartService;
import com.shop.order_service.common.utils.CodeGenerator;
import com.shop.order_service.order.dto.OrderData;
import com.shop.order_service.order.dto.response.OrderDtoResponse;
import com.shop.order_service.order.model.OrderEntryModel;
import com.shop.order_service.order.model.OrderModel;
import com.shop.order_service.order.populator.OrderPopulator;
import com.shop.order_service.order.repository.OrderRepository;
import com.shop.order_service.order.service.OrderService;
import com.shop.order_service.order.type.OrderStatus;
import com.shop.order_service.payment.model.PaymentInfoModel;
import com.shop.order_service.payment.model.PaymentTransactionModel;
import com.shop.order_service.payment.processor.PaymentProcessor;
import com.shop.order_service.payment.processor.factory.PaymentProcessorFactory;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultOrderService implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderPopulator orderPopulator;
    private final CartService cartService;
    private final PaymentProcessorFactory paymentProcessorFactory;

    @Override
    @Transactional
    public OrderDtoResponse placeOrder(CartModel cart) {
        if (cart == null || cart.getEntries().isEmpty()) {
            log.error("Cart is empty or null. Cannot place order.");
            throw new IllegalStateException("Cart is empty, cannot place order");
        }
        log.info("Starting order place for cart: {}", cart.getCode());

        try {
            OrderModel order = orderPopulator.cartToOrder(cart);
            order.setCode(generateOrderCode());
            order.setStatus(OrderStatus.READY);
            order.getEntries().forEach(entry -> entry.setOrder(order));
            log.info("Order model created with code {}", order.getCode());

            PaymentProcessor processor = paymentProcessorFactory.getProcessor(order.getPaymentMethod());
            PaymentTransactionModel transactionModel = processor.createPayment(order);
            order.setPayments(Collections.singletonList(transactionModel));

            OrderModel savedOrder = orderRepository.save(order);
            log.info("Order saved successfully with ID {}", savedOrder.getId());
            return orderPopulator.toResponseDto(savedOrder);

        } catch (Exception e) {
            log.error("Error occurred while placing order", e);
            throw e;
        }
    }

    @Override
    public OrderDtoResponse getOrderByCode(String code) {
        log.info("Fetching order by code: {}", code);
        OrderModel order = orderRepository.findByCode(code)
                .orElseThrow(() -> {
                    log.error("Order not found with code: {}", code);
                    return new IllegalArgumentException("Order not found with code: " + code);
                });
        log.info("Order found with code: {}", code);
        return orderPopulator.toResponseDto(order);
    }

    @Override
    public List<OrderDtoResponse> getOrdersByCustomerEmail(String email) {
        log.info("Fetching orders for customer email: {}", email);
        List<OrderModel> orders = orderRepository.findAll().stream()
                .filter(order -> order.getOwner().equals(email))
                .collect(Collectors.toList());
        log.info("Found {} orders for customer email: {}", orders.size(), email);
        return orderPopulator.toResponseDtoList(orders);
    }

    @Override
    public List<OrderDtoResponse> getAllOrders() {
        log.info("Fetching all orders");
        List<OrderModel> orders = orderRepository.findAll();
        log.info("Total orders found: {}", orders.size());
        return orderPopulator.toResponseDtoList(orders);    }

    @Override
    @Transactional
    public OrderDtoResponse updateOrderStatus(String code, OrderStatus status) {
        log.info("Updating status for order code: {} to {}", code, status);
        OrderModel order = orderRepository.findByCode(code)
                .orElseThrow(() -> {
                    log.error("Order not found with code: {}", code);
                    return new IllegalArgumentException("Order not found with code: " + code);
                });
        order.setStatus(status);
        OrderModel updatedOrder = orderRepository.save(order);
        log.info("Order status updated successfully for code: {}", code);
        return orderPopulator.toResponseDto(updatedOrder);
    }

    private String generateOrderCode() {
        return "ORD-" + CodeGenerator.generateCode();
    }
}
