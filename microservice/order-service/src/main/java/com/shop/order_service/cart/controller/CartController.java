package com.shop.order_service.cart.controller;

import com.shop.order_service.cart.dto.response.CartDtoResponse;
import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.service.impl.DefaultCartSessionService;
import com.shop.order_service.payment.type.PaymentMethod;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/api/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {
    private final DefaultCartSessionService cartSessionService;

    @GetMapping
    public ResponseEntity<CartDtoResponse> getCart() {
        log.info("Request received: GET /api/cart");
        CartDtoResponse cart = cartSessionService.getCartSession();
        cartSessionService.extendSessionTTL();
        log.info("Request completed: GET /api/cart - Status: 200, cartCode: {}", cart.getCode());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<CartDtoResponse> addToCart(@RequestBody CartEntryDto cartEntryDto) {
        log.info("Request received: POST /api/cart/add - productCode: {}, quantity: {}", cartEntryDto.getProduct(), cartEntryDto.getQuantity());
        cartSessionService.addToCart(cartEntryDto);
        CartDtoResponse cart = cartSessionService.getCartSession();
        log.info("Request completed: POST /api/cart/add - Status: 200, cartCode: {}", cart.getCode());
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/remove/{entry}")
    public ResponseEntity<CartDtoResponse> removeFromCart(@PathVariable("entry") String entry) {
        log.info("Request received: DELETE /api/cart/remove/{}", entry);
        cartSessionService.removeFromCart(entry);
        CartDtoResponse cart = cartSessionService.getCartSession();
        log.info("Request completed: DELETE /api/cart/remove/{} - Status: 200 cart: {}", entry, cart.getCode());
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update")
    public ResponseEntity<CartDtoResponse> updateQuantity(@RequestBody CartEntryDto cartEntryDto) {
        log.info("Request received: PUT /api/cart/update - productCode: {}, quantity: {}", cartEntryDto.getProduct(), cartEntryDto.getQuantity());
        cartSessionService.updateQuantity(cartEntryDto);
        CartDtoResponse cart = cartSessionService.getCartSession();
        log.info("Request completed: PUT /api/cart/update - Status: 200 cart: {}", cart.getCode());
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update/address/{id}")
    public ResponseEntity<CartDtoResponse> updateAddress(@PathVariable("id") Long id) {
        log.info("Request received: PUT /api/cart/update/address/{}", id);
        cartSessionService.updateAddress(id);
        CartDtoResponse cart = cartSessionService.getCartSession();
        log.info("Request completed: PUT /api/cart/update/address/{} - Status: 200 cart: {}", id, cart.getCode());
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update/payment/{paymentMethod}")
    public ResponseEntity<CartDtoResponse> updatePayment(@PathVariable("paymentMethod") PaymentMethod paymentMethod) {
        log.info("Request received: PUT /api/cart/update/payment/{}", paymentMethod);
        cartSessionService.updatePayment(paymentMethod);
        CartDtoResponse cart = cartSessionService.getCartSession();
        log.info("Request completed: PUT /api/cart/update/payment/{} - Status: 200 cart: {}", paymentMethod, cart.getCode());
        return ResponseEntity.ok(cart);
    }
}
