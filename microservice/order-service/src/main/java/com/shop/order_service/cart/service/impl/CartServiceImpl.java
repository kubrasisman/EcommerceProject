package com.shop.order_service.cart.service.impl;

import com.shop.order_service.cart.dto.CartEntryData;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.repository.CartRepository;
import com.shop.order_service.cart.service.CartService;
import jakarta.servlet.http.HttpSession;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CartServiceImpl implements CartService {


    private CartRepository cartRepository;

    @Override
    public CartModel getCart(HttpSession session) {
        return new CartModel();
    }

    @Override
    public CartModel addProductToCart(HttpSession session, CartEntryData entryDto) {
        return new CartModel();
    }

    public void removeProduct(HttpSession session, Long productId) {
    }
}
