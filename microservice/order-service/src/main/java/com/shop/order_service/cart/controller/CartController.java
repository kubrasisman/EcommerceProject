package com.shop.order_service.cart.controller;

import com.shop.order_service.cart.populator.CartPopulator;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartPopulator cartPopulator;
}
