package com.shop.order_service.order.controller;

import com.shop.order_service.order.dto.response.OrderDtoResponse;
import com.shop.order_service.order.service.OrderService;
import com.shop.order_service.order.type.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping(value = "api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/{code}")
    public ResponseEntity<OrderDtoResponse> getOrderByCode(@PathVariable String code) {
        log.info("API call: getOrderByCode, code={}", code);
        OrderDtoResponse order = orderService.getOrderByCode(code);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/customer")
    public ResponseEntity<List<OrderDtoResponse>> getOrdersByCustomerEmail(@RequestParam String email) {
        log.info("API call: getOrdersByCustomerEmail, email={}", email);
        List<OrderDtoResponse> orders = orderService.getOrdersByCustomerEmail(email);
        return ResponseEntity.ok(orders);
    }

    @GetMapping
    public ResponseEntity<List<OrderDtoResponse>> getAllOrders() {
        log.info("API call: getAllOrders");
        List<OrderDtoResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{code}/status")
    public ResponseEntity<OrderDtoResponse> updateOrderStatus(
            @PathVariable String code,
            @RequestParam String status) {
        log.info("API call: updateOrderStatus, code={}, status={}", code, status);
        OrderDtoResponse updatedOrder = orderService.updateOrderStatus(code, OrderStatus.valueOf(status));
        return ResponseEntity.ok(updatedOrder);
    }


}
