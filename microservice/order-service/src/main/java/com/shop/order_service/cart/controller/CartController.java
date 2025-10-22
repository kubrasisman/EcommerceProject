package com.shop.order_service.cart.controller;

import com.shop.order_service.cart.dto.CartData;
import com.shop.order_service.cart.dto.CartEntryData;
import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.populator.CartPopulator;
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
    public ResponseEntity<CartData> getCart() {
        CartData cart = cartSessionService.getCartSession();
        cartSessionService.extendSessionTTL();
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<CartData> addToCart(@RequestBody CartEntryDto cartEntryDto) {
        cartSessionService.addToCart(cartEntryDto);
        CartData cart = cartSessionService.getCartSession();
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/remove/{entry}")
    public ResponseEntity<CartData> removeFromCart(@PathVariable("entry") String entry) {
        cartSessionService.removeFromCart(entry);
        CartData cart = cartSessionService.getCartSession();
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update")
    public ResponseEntity<CartData> updateQuantity(@RequestBody CartEntryDto cartEntryDto) {
        cartSessionService.updateQuantity(cartEntryDto);
        CartData cart = cartSessionService.getCartSession();
        return ResponseEntity.ok(cart);
    }

}
