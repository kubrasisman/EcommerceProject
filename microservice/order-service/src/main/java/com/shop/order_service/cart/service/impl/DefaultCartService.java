package com.shop.order_service.cart.service.impl;

import com.shop.order_service.common.logging.MdcContextUtil;
import com.shop.order_service.common.utils.UserUtil;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.repository.CartRepository;
import com.shop.order_service.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultCartService implements CartService {

    private final CartRepository cartRepository;

    @Override
    public CartModel getCart() {
        String currentUser = UserUtil.current();
        log.debug("CART: Fetching cart for user: {}", currentUser);

        Optional<CartModel> cartModelOptional = cartRepository.findByOwner(currentUser);
        if (cartModelOptional.isPresent()) {
            CartModel cart = cartModelOptional.get();
            MdcContextUtil.setCartContext(cart.getCode());
            log.debug("CART: Found existing cart - cartCode: {}", cart.getCode());
            return cart;
        }

        log.info("CART: Creating new cart for user: {}", currentUser);
        CartModel cartModel = new CartModel();
        cartModel.setOwner(currentUser);
        cartModel.setCode(UUID.randomUUID().toString());
        cartModel.setTotalPrice(0D);
        cartModel.setEntries(new ArrayList<>());

        CartModel savedCart = cartRepository.save(cartModel);
        MdcContextUtil.setCartContext(savedCart.getCode());
        log.info("CART: New cart created - cartCode: {}", savedCart.getCode());
        return savedCart;
    }

    @Override
    public CartModel getCartByCode(String code) {
        MdcContextUtil.setCartContext(code);
        log.debug("CART: Fetching cart by code: {}", code);

        return cartRepository.findByCode(code)
                .orElseThrow(() -> {
                    log.warn("CART: Cart not found - cartCode: {}", code);
                    return new IllegalArgumentException("Cart not found with code: " + code);
                });
    }

    @Override
    public CartModel saveCart(CartModel cartModel) {
        MdcContextUtil.setCartContext(cartModel.getCode());
        log.debug("CART: Saving cart - cartCode: {}, totalPrice: {}", cartModel.getCode(), cartModel.getTotalPrice());
        return cartRepository.save(cartModel);
    }

    @Override
    public void removeCart() {
        CartModel cart = getCart();
        MdcContextUtil.setCartContext(cart.getCode());
        log.info("CART: Removing cart - cartCode: {}", cart.getCode());
        cartRepository.delete(cart);
    }
}
