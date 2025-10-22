package com.shop.order_service.cart.service.impl;

import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.populator.CartPopulator;
import com.shop.order_service.cart.service.CartEntryService;
import com.shop.order_service.cart.service.CartService;
import com.shop.order_service.common.utils.UserUtil;
import com.shop.order_service.cart.dto.CartData;
import com.shop.order_service.cart.dto.CartEntryData;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class DefaultCartSessionService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final CartEntryService cartEntryService;
    private final CartService cartService;
    private final CartPopulator cartPopulator;
    private static final String CART_SESSION_PREFIX = "cart:";
    private static final long CART_SESSION_TTL_HOURS = 24;

    public void saveCartSession(CartData cartData) {
        String key = CART_SESSION_PREFIX + UserUtil.current();
        redisTemplate.opsForValue().set(key, cartData, CART_SESSION_TTL_HOURS, TimeUnit.HOURS);
    }

    public CartData getCartSession() {
        String key = CART_SESSION_PREFIX + UserUtil.current();
        Object cartData = redisTemplate.opsForValue().get(key);

        if (cartData instanceof CartData) {
            return (CartData) cartData;
        }

        CartModel cart = cartService.getCart();
        CartData data = cartPopulator.toData(cart);
        saveCartSession(data);
        return data;
    }

    public void addToCart(CartEntryDto cartEntryDto) {
        CartEntryModel cartEntryModel = cartEntryService.addCartEntry(cartEntryDto);
        CartModel cartModel = cartEntryModel.getCart();
        recalculateTotal(cartModel);
        CartModel savedCart = cartService.saveCart(cartModel);
        CartData data = cartPopulator.toData(savedCart);
        saveCartSession(data);
    }

    public void removeFromCart(String entry) {
        cartEntryService.deleteCartEntry(entry);
        CartModel cart = cartService.getCart();
        recalculateTotal(cart);
        CartModel cartModel = cartService.saveCart(cart);
        CartData cartData = cartPopulator.toData(cartModel);
        saveCartSession(cartData);
    }

    public void updateQuantity(CartEntryDto cartEntryDto) {
        CartEntryModel cartEntryModel = cartEntryService.updateCartEntry(cartEntryDto);
        CartModel cart = cartEntryModel.getCart();
        recalculateTotal(cart);
        CartModel cartModel = cartService.saveCart(cart);
        CartData cartData = cartPopulator.toData(cartModel);
        saveCartSession(cartData);
    }

    public void clearCart() {
        String key = CART_SESSION_PREFIX + UserUtil.current();
        redisTemplate.delete(key);
    }

    private void recalculateTotal(CartModel cartModel) {
        double total = 0.0;
        if (cartModel.getEntries() != null) {
            for (CartEntryModel entry : cartModel.getEntries()) {
                total += entry.getBasePrice() * entry.getQuantity();
                entry.setTotalPrice(total);
            }
        }
        cartModel.setTotalPrice(total);
    }

    public void extendSessionTTL() {
        String key = CART_SESSION_PREFIX + UserUtil.current();
        redisTemplate.expire(key, CART_SESSION_TTL_HOURS, TimeUnit.HOURS);
    }
}
