package com.shop.order_service.cart.controller;

import com.shop.order_service.cart.dto.CartData;
import com.shop.order_service.cart.dto.CartEntryData;
import com.shop.order_service.cart.populator.CartPopulator;
import com.shop.order_service.cart.service.CartSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartPopulator cartPopulator;
    private final CartSessionService cartSessionService;

    @GetMapping
    public ResponseEntity<CartData> getCart(@RequestHeader("X-Customer-Id") String customerId) {
        CartData cart = cartSessionService.getCartSession(customerId);
        cartSessionService.extendSessionTTL(customerId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<CartData> addToCart(
            @RequestHeader("X-Customer-Id") String customerId,
            @RequestBody CartEntryData entryData) {
        cartSessionService.addToCart(customerId, entryData);
        CartData cart = cartSessionService.getCartSession(customerId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartData> removeFromCart(
            @RequestHeader("X-Customer-Id") String customerId,
            @PathVariable Long productId) {
        cartSessionService.removeFromCart(customerId, productId);
        CartData cart = cartSessionService.getCartSession(customerId);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<CartData> updateQuantity(
            @RequestHeader("X-Customer-Id") String customerId,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        cartSessionService.updateQuantity(customerId, productId, quantity);
        CartData cart = cartSessionService.getCartSession(customerId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestHeader("X-Customer-Id") String customerId) {
        cartSessionService.clearCart(customerId);
        return ResponseEntity.ok().build();
    }
}
