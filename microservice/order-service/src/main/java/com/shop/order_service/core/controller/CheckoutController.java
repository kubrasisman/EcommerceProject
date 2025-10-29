package com.shop.order_service.core.controller;

import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.service.CartService;
import com.shop.order_service.common.utils.UserUtil;
import com.shop.order_service.order.dto.response.OrderDtoResponse;
import com.shop.order_service.order.service.OrderService;
import com.shop.order_service.payment.type.PaymentMethod;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/orders/checkout")
@RequiredArgsConstructor
@Slf4j
public class CheckoutController {
    private static final String CART_SESSION_PREFIX = "cart:";
    private final OrderService orderService;
    private final CartService cartService;
    private final RedisTemplate<String, Object> redisTemplate;
    @PostMapping
    @Transactional
    public OrderDtoResponse placeOrder() {
        CartModel cart = cartService.getCart();
        OrderDtoResponse response = orderService.placeOrder(cart);
        log.info("Order created with code: {}", response.getCode());
        cartService.removeCart();
        String key = CART_SESSION_PREFIX + UserUtil.current();
        redisTemplate.delete(key);
        return response;
    }
}
