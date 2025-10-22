package com.shop.order_service.cart.service.impl;

import com.shop.order_service.common.utils.UserUtil;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.repository.CartRepository;
import com.shop.order_service.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class DefaultCartService implements CartService {

    private final CartRepository cartRepository;
    @Override
    public CartModel getCart() {
        Optional<CartModel> cartModelOptional = cartRepository.findByOwner(UserUtil.current());
        if (cartModelOptional.isPresent()) {
            return cartModelOptional.get();
        }

        CartModel cartModel = new CartModel();
        cartModel.setOwner(UserUtil.current());
        cartModel.setCode(UUID.randomUUID().toString());
        cartModel.setTotalPrice(0D);
        cartModel.setEntries(new ArrayList<>());

        return cartRepository.save(cartModel);
    }


    @Override
    public CartModel saveCart(CartModel cartModel) {
        return cartRepository.save(cartModel);
    }
}
