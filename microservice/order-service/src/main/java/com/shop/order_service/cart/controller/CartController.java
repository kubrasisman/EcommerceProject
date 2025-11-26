package com.shop.order_service.cart.controller;

import com.shop.order_service.cart.dto.response.CartDtoResponse;
import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.service.impl.DefaultCartSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final DefaultCartSessionService cartSessionService;

    @GetMapping
    public ResponseEntity<CartDtoResponse> getCart() {
        CartDtoResponse cart = cartSessionService.getCartSession();
        cartSessionService.extendSessionTTL();
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<CartDtoResponse> addToCart(@RequestBody CartEntryDto cartEntryDto) {
        cartSessionService.addToCart(cartEntryDto);
        CartDtoResponse cart = cartSessionService.getCartSession();
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/remove/{entry}")
    public ResponseEntity<CartDtoResponse> removeFromCart(@PathVariable("entry") String entry) {
        cartSessionService.removeFromCart(entry);
        CartDtoResponse cart = cartSessionService.getCartSession();
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update")
    public ResponseEntity<CartDtoResponse> updateQuantity(@RequestBody CartEntryDto cartEntryDto) {
        cartSessionService.updateQuantity(cartEntryDto);
        CartDtoResponse cart = cartSessionService.getCartSession();
        return ResponseEntity.ok(cart);
    }

}
