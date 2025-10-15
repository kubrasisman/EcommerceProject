package com.shop.order_service.cart.service;

import com.shop.order_service.cart.dto.CartEntryData;
import com.shop.order_service.cart.model.CartModel;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public interface CartService {

    CartModel getCart(HttpSession session);
    CartModel addProductToCart(HttpSession session, CartEntryData entryDto);
    void removeProduct(HttpSession session, Long productId);
}
