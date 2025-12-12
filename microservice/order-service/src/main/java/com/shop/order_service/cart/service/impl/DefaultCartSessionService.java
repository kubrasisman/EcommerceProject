package com.shop.order_service.cart.service.impl;

import com.shop.order_service.cache.services.CacheService;
import com.shop.order_service.cart.dto.response.AddressDtoResponse;
import com.shop.order_service.cart.dto.response.CartDtoResponse;
import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.populator.CartPopulator;
import com.shop.order_service.cart.service.CartEntryService;
import com.shop.order_service.cart.service.CartService;
import com.shop.order_service.common.client.CustomerServiceClient;
import com.shop.order_service.common.utils.UserUtil;
import com.shop.order_service.payment.type.PaymentMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class DefaultCartSessionService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final CartEntryService cartEntryService;
    private final CartService cartService;
    private final CartPopulator cartPopulator;
    private final CustomerServiceClient customerServiceClient;
    private final CacheService cacheService;
    private static final String CART_SESSION_PREFIX = "cart:";
    private static final long CART_SESSION_TTL_HOURS = 24;

    public void saveCartSession(CartDtoResponse cartData) {
        cacheService.saveCache(CART_SESSION_PREFIX, UserUtil.current(), cartData, CART_SESSION_TTL_HOURS);
    }

    public CartDtoResponse getCartSession() {
        Object cartData = cacheService.getCacheValue(CART_SESSION_PREFIX, UserUtil.current());

        if (cartData instanceof CartDtoResponse) {
            return (CartDtoResponse) cartData;
        }

        CartModel cart = cartService.getCart();
        CartDtoResponse data = cartPopulator.toResponseDto(cart);
        saveCartSession(data);
        return data;
    }

    public void addToCart(CartEntryDto cartEntryDto) {
        CartModel cartModel = cartService.getCart();
        Optional<CartEntryModel> cartEntryModelOptional = cartModel.getEntries().stream().filter(e-> e.getProduct().equals(cartEntryDto.getProduct())).findFirst();
        if (cartEntryModelOptional.isPresent()){
            CartEntryModel cartEntryModel = cartEntryModelOptional.get();
            cartEntryModel.setQuantity(cartEntryModel.getQuantity() + cartEntryDto.getQuantity());
            CartEntryModel saveCartEntry = cartEntryService.saveCartEntry(cartEntryModel);
            CartModel cart = saveCartEntry.getCart();
            recalculateTotal(cart);
            CartDtoResponse data = cartPopulator.toResponseDto(cart);
            saveCartSession(data);
            return;
        }
        cartEntryService.addCartEntry(cartModel, cartEntryDto);
        recalculateTotal(cartModel);
        CartModel savedCart = cartService.saveCart(cartModel);
        CartDtoResponse data = cartPopulator.toResponseDto(savedCart);
        saveCartSession(data);
    }

    public void removeFromCart(String entry) {
        CartModel cart = cartService.getCart();
        cartEntryService.deleteCartEntry(cart, entry);
        recalculateTotal(cart);
        CartModel cartModel = cartService.saveCart(cart);
        CartDtoResponse cartData = cartPopulator.toResponseDto(cartModel);
        saveCartSession(cartData);
    }

    public void updateQuantity(CartEntryDto cartEntryDto) {
        CartEntryModel cartEntryModel = cartEntryService.updateCartEntry(cartEntryDto);
        CartModel cart = cartEntryModel.getCart();
        recalculateTotal(cart);
        CartModel cartModel = cartService.saveCart(cart);
        CartDtoResponse cartData = cartPopulator.toResponseDto(cartModel);
        saveCartSession(cartData);
    }

    public void clearCart() {
        cacheService.removeCache(CART_SESSION_PREFIX, UserUtil.current());
    }

    private void recalculateTotal(CartModel cartModel) {
        double total = 0.0;
        if (cartModel.getEntries() != null) {
            for (CartEntryModel entry : cartModel.getEntries()) {
                double entryTotal = entry.getBasePrice() * entry.getQuantity();
                total += entryTotal;
                entry.setTotalPrice(entryTotal);
            }
        }
        cartModel.setTotalPrice(total);
    }

    public void extendSessionTTL() {
        cacheService.extendCache(CART_SESSION_PREFIX, UserUtil.current(), CART_SESSION_TTL_HOURS, TimeUnit.HOURS);
    }

    public void updateAddress(Long id) {
        AddressDtoResponse address = customerServiceClient.getAddress(id);
        CartModel cart = cartService.getCart();
        cart.setAddress(address.getId());
        CartModel cartModel = cartService.saveCart(cart);
        CartDtoResponse cartData = cartPopulator.toResponseDto(cartModel);
        saveCartSession(cartData);
    }

    public void updatePayment(PaymentMethod paymentMethod) {
        CartModel cart = cartService.getCart();
        cart.setPaymentMethod(paymentMethod);
        CartModel cartModel = cartService.saveCart(cart);
        CartDtoResponse cartData = cartPopulator.toResponseDto(cartModel);
        saveCartSession(cartData);
    }
}
