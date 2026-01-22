package com.shop.order_service.cart.service;

import com.shop.order_service.cart.model.CartModel;

import java.util.List;

public interface CartService {
    CartModel getCart();
    CartModel saveCart(CartModel cartModel);
    CartModel getCartByCode(String code);
    void removeCart();
    List<CartModel> getAllCarts();
    void removeCartByCode(String code);
    void removeEntryFromCart(String cartCode, String entryCode);
}
