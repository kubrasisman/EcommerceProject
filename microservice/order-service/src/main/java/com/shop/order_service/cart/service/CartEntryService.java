package com.shop.order_service.cart.service;

import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import org.springframework.stereotype.Service;

import java.util.Optional;

public interface CartEntryService {
    CartEntryModel addCartEntry(CartModel cartModel, CartEntryDto cartEntryDto);
    CartEntryModel updateCartEntry(CartEntryDto cartEntryDto);
    void deleteCartEntry(CartModel cartModel, String code);
    Optional<CartEntryModel> findByProduct(String product);
    CartEntryModel saveCartEntry(CartEntryModel cartEntryModel);
}
