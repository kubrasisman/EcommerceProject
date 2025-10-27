package com.shop.order_service.cart.service;

import com.shop.order_service.cart.model.CartModel;

public interface CartService {
    CartModel getCart();
    CartModel saveCart(CartModel cartModel);
    CartModel getCartByCode(String code);
}
