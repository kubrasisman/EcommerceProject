package com.shop.order_service.cart.service;

import com.shop.order_service.cart.dto.CartData;
import com.shop.order_service.cart.dto.CartEntryData;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class CartSessionService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String CART_SESSION_PREFIX = "cart:";
    private static final long CART_SESSION_TTL_HOURS = 24;

    public CartSessionService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveCartSession(String customerId, CartData cartData) {
        String key = CART_SESSION_PREFIX + customerId;
        redisTemplate.opsForValue().set(key, cartData, CART_SESSION_TTL_HOURS, TimeUnit.HOURS);
    }

    public CartData getCartSession(String customerId) {
        String key = CART_SESSION_PREFIX + customerId;
        Object cartData = redisTemplate.opsForValue().get(key);

        if (cartData instanceof CartData) {
            return (CartData) cartData;
        }

        CartData newCart = new CartData();
        newCart.setCustomerId(Long.parseLong(customerId));
        newCart.setEntries(new ArrayList<>());
        newCart.setTotalPrice(0.0);
        return newCart;
    }

    public void addToCart(String customerId, CartEntryData entryData) {
        CartData cart = getCartSession(customerId);

        List<CartEntryData> entries = cart.getEntries();
        if (entries == null) {
            entries = new ArrayList<>();
            cart.setEntries(entries);
        }

        boolean found = false;
        for (CartEntryData entry : entries) {
            if (entry.getProductId().equals(entryData.getProductId())) {
                entry.setQuantity(entry.getQuantity() + entryData.getQuantity());
                found = true;
                break;
            }
        }

        if (!found) {
            entries.add(entryData);
        }

        recalculateTotal(cart);
        saveCartSession(customerId, cart);
    }

    public void removeFromCart(String customerId, Long productId) {
        CartData cart = getCartSession(customerId);

        if (cart.getEntries() != null) {
            cart.getEntries().removeIf(entry -> entry.getProductId().equals(productId));
            recalculateTotal(cart);
            saveCartSession(customerId, cart);
        }
    }

    public void updateQuantity(String customerId, Long productId, Integer quantity) {
        CartData cart = getCartSession(customerId);

        if (cart.getEntries() != null) {
            for (CartEntryData entry : cart.getEntries()) {
                if (entry.getProductId().equals(productId)) {
                    entry.setQuantity(quantity);
                    break;
                }
            }
            recalculateTotal(cart);
            saveCartSession(customerId, cart);
        }
    }

    public void clearCart(String customerId) {
        String key = CART_SESSION_PREFIX + customerId;
        redisTemplate.delete(key);
    }

    private void recalculateTotal(CartData cart) {
        double total = 0.0;
        if (cart.getEntries() != null) {
            for (CartEntryData entry : cart.getEntries()) {
                total += entry.getPrice() * entry.getQuantity();
            }
        }
        cart.setTotalPrice(total);
    }

    public void extendSessionTTL(String customerId) {
        String key = CART_SESSION_PREFIX + customerId;
        redisTemplate.expire(key, CART_SESSION_TTL_HOURS, TimeUnit.HOURS);
    }
}
