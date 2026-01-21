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
import com.shop.order_service.common.logging.MdcContextUtil;
import com.shop.order_service.common.utils.UserUtil;
import com.shop.order_service.payment.type.PaymentMethod;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
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
        log.debug("CART SESSION: Saving cart session for user: {}, cartCode: {}", UserUtil.current(), cartData.getCode());
        cacheService.saveCache(CART_SESSION_PREFIX, UserUtil.current(), cartData, CART_SESSION_TTL_HOURS);
    }

    public CartDtoResponse getCartSession() {
        String currentUser = UserUtil.current();
        log.debug("CART SESSION: Getting cart session for user: {}", currentUser);

        Object cartData = cacheService.getCacheValue(CART_SESSION_PREFIX, currentUser);

        if (cartData instanceof CartDtoResponse) {
            CartDtoResponse cachedCart = (CartDtoResponse) cartData;
            MdcContextUtil.setCartContext(cachedCart.getCode());
            log.debug("CART SESSION: Cache hit for user: {}, cartCode: {}", currentUser, cachedCart.getCode());
            return cachedCart;
        }

        log.debug("CART SESSION: Cache miss for user: {}, loading from database", currentUser);
        CartModel cart = cartService.getCart();
        CartDtoResponse data = cartPopulator.toResponseDto(cart);
        MdcContextUtil.setCartContext(data.getCode());
        saveCartSession(data);
        return data;
    }

    public void addToCart(CartEntryDto cartEntryDto) {
        log.info("CART SESSION: Adding product to cart - productCode: {}, quantity: {}", cartEntryDto.getProduct(), cartEntryDto.getQuantity());

        CartModel cartModel = cartService.getCart();
        MdcContextUtil.setCartContext(cartModel.getCode());

        Optional<CartEntryModel> cartEntryModelOptional = cartModel.getEntries().stream().filter(e-> e.getProduct().equals(cartEntryDto.getProduct())).findFirst();
        if (cartEntryModelOptional.isPresent()){
            CartEntryModel cartEntryModel = cartEntryModelOptional.get();
            int newQuantity = cartEntryModel.getQuantity() + cartEntryDto.getQuantity();
            log.info("CART SESSION: Updating existing entry quantity - entryCode: {}, oldQuantity: {}, newQuantity: {}", cartEntryModel.getCode(), cartEntryModel.getQuantity(), newQuantity);
            cartEntryModel.setQuantity(newQuantity);
            CartEntryModel saveCartEntry = cartEntryService.saveCartEntry(cartEntryModel);
            CartModel cart = saveCartEntry.getCart();
            recalculateTotal(cart);
            CartDtoResponse data = cartPopulator.toResponseDto(cart);
            saveCartSession(data);
            return;
        }
        log.info("CART SESSION: Adding new entry to cart - cartCode: {}", cartModel.getCode());
        cartEntryService.addCartEntry(cartModel, cartEntryDto);
        recalculateTotal(cartModel);
        CartModel savedCart = cartService.saveCart(cartModel);
        CartDtoResponse data = cartPopulator.toResponseDto(savedCart);
        saveCartSession(data);
    }

    public void removeFromCart(String entry) {
        log.info("CART SESSION: Removing entry from cart - entryCode: {}", entry);
        CartModel cart = cartService.getCart();
        MdcContextUtil.setCartContext(cart.getCode());

        cartEntryService.deleteCartEntry(cart, entry);
        recalculateTotal(cart);
        CartModel cartModel = cartService.saveCart(cart);
        CartDtoResponse cartData = cartPopulator.toResponseDto(cartModel);
        saveCartSession(cartData);
        log.info("CART SESSION: Entry removed successfully - cartCode: {}, newTotal: {}", cart.getCode(), cart.getTotalPrice());
    }

    public void updateQuantity(CartEntryDto cartEntryDto) {
        log.info("CART SESSION: Updating entry quantity - entryCode: {}, newQuantity: {}", cartEntryDto.getCode(), cartEntryDto.getQuantity());
        CartEntryModel cartEntryModel = cartEntryService.updateCartEntry(cartEntryDto);
        CartModel cart = cartEntryModel.getCart();
        MdcContextUtil.setCartContext(cart.getCode());

        recalculateTotal(cart);
        CartModel cartModel = cartService.saveCart(cart);
        CartDtoResponse cartData = cartPopulator.toResponseDto(cartModel);
        saveCartSession(cartData);
        log.info("CART SESSION: Quantity updated - cartCode: {}, newTotal: {}", cart.getCode(), cart.getTotalPrice());
    }

    public void clearCart() {
        log.info("CART SESSION: Clearing cart session for user: {}", UserUtil.current());
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
        log.debug("CART SESSION: Extending TTL for user: {}", UserUtil.current());
        cacheService.extendCache(CART_SESSION_PREFIX, UserUtil.current(), CART_SESSION_TTL_HOURS, TimeUnit.HOURS);
    }

    public void updateAddress(Long id) {
        log.info("CART SESSION: Updating cart address - addressId: {}", id);
        AddressDtoResponse address = customerServiceClient.getAddress(id);
        CartModel cart = cartService.getCart();
        MdcContextUtil.setCartContext(cart.getCode());

        cart.setAddress(address.getId());
        CartModel cartModel = cartService.saveCart(cart);
        CartDtoResponse cartData = cartPopulator.toResponseDto(cartModel);
        saveCartSession(cartData);
        log.info("CART SESSION: Address updated - cartCode: {}, addressId: {}", cart.getCode(), id);
    }

    public void updatePayment(PaymentMethod paymentMethod) {
        log.info("CART SESSION: Updating payment method - paymentMethod: {}", paymentMethod);
        CartModel cart = cartService.getCart();
        MdcContextUtil.setCartContext(cart.getCode());

        cart.setPaymentMethod(paymentMethod);
        CartModel cartModel = cartService.saveCart(cart);
        CartDtoResponse cartData = cartPopulator.toResponseDto(cartModel);
        saveCartSession(cartData);
        log.info("CART SESSION: Payment method updated - cartCode: {}, paymentMethod: {}", cart.getCode(), paymentMethod);
    }
}
