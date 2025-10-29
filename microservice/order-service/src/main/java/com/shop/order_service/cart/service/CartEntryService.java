package com.shop.order_service.cart.service;

import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import org.springframework.stereotype.Service;

import java.util.Optional;

public interface CartEntryService {
    CartEntryModel addCartEntry(CartEntryDto cartEntryDto);
    CartEntryModel updateCartEntry(CartEntryDto cartEntryDto);
    void deleteCartEntry(String code);
    Optional<CartEntryModel> findByProduct(String product);
    CartEntryModel saveCartEntry(CartEntryModel cartEntryModel);
}
