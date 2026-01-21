package com.shop.order_service.cart.service.impl;

import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.repository.CartRepository;
import com.shop.order_service.common.client.ProductServiceClient;
import com.shop.order_service.common.dto.response.ProductDtoResponse;
import com.shop.order_service.common.logging.MdcContextUtil;
import com.shop.order_service.common.utils.UserUtil;
import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.repository.CartEntryRepository;
import com.shop.order_service.cart.service.CartEntryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultCartEntryService implements CartEntryService {
    private final CartEntryRepository cartEntryRepository;
    private final ProductServiceClient productServiceClient;
    private final CartRepository cartRepository;

    @Override
    public CartEntryModel addCartEntry(CartModel cartModel, CartEntryDto cartEntryDto) {
        MdcContextUtil.setCartContext(cartModel.getCode());
        MdcContextUtil.setProductContext(cartEntryDto.getProduct());
        log.info("CART ENTRY: Adding new entry - cartCode: {}, productCode: {}, quantity: {}", cartModel.getCode(), cartEntryDto.getProduct(), cartEntryDto.getQuantity());

        ProductDtoResponse product = productServiceClient.getProduct(cartEntryDto.getProduct());

        CartEntryModel cartEntryModel = new CartEntryModel();
        cartEntryModel.setCode(UUID.randomUUID().toString());
        cartEntryModel.setBasePrice(product.getPrice());
        cartEntryModel.setQuantity(cartEntryDto.getQuantity());
        cartEntryModel.setTotalPrice(cartEntryModel.getBasePrice() * cartEntryModel.getQuantity());
        cartEntryModel.setProduct(product.getCode());
        cartEntryModel.setOwner(cartModel.getOwner());

        cartEntryModel.setCart(cartModel);
        cartModel.getEntries().add(cartEntryModel);

        CartEntryModel savedEntry = cartEntryRepository.save(cartEntryModel);
        log.info("CART ENTRY: Entry added - entryCode: {}, basePrice: {}, totalPrice: {}", savedEntry.getCode(), savedEntry.getBasePrice(), savedEntry.getTotalPrice());
        return savedEntry;
    }

    @Override
    public CartEntryModel updateCartEntry(CartEntryDto cartEntryDto) {
        log.info("CART ENTRY: Updating entry - entryCode: {}, newQuantity: {}", cartEntryDto.getCode(), cartEntryDto.getQuantity());

        Optional<CartEntryModel> cartEntryModelOptional = cartEntryRepository.findByOwnerAndCode(UserUtil.current(), cartEntryDto.getCode());
        if (cartEntryModelOptional.isEmpty()){
            log.warn("CART ENTRY: Entry not found - entryCode: {}", cartEntryDto.getCode());
            throw new RuntimeException("Cannot Find Cart Entry");
        }

        ProductDtoResponse product = productServiceClient.getProduct(cartEntryDto.getProduct());
        CartEntryModel cartEntryModel = cartEntryModelOptional.get();
        cartEntryModel.setBasePrice(product.getPrice());
        cartEntryModel.setQuantity(cartEntryDto.getQuantity());

        CartEntryModel savedEntry = cartEntryRepository.save(cartEntryModel);
        log.info("CART ENTRY: Entry updated - entryCode: {}, newBasePrice: {}", savedEntry.getCode(), savedEntry.getBasePrice());
        return savedEntry;
    }

    @Override
    public void deleteCartEntry(CartModel cartModel, String code) {
        MdcContextUtil.setCartContext(cartModel.getCode());
        log.info("CART ENTRY: Deleting entry - cartCode: {}, entryCode: {}", cartModel.getCode(), code);

        Optional<CartEntryModel> cartEntryModelOptional  = cartModel.getEntries().stream().filter(e-> e.getCode().equals(code)).findFirst();
        if (cartEntryModelOptional.isEmpty()){
            log.warn("CART ENTRY: Entry not found for deletion - entryCode: {}", code);
            throw new RuntimeException("Entry Not Found");
        }
        CartEntryModel entry = cartEntryModelOptional.get();
        cartModel.getEntries().remove(entry);
        cartEntryRepository.delete(entry);
        log.info("CART ENTRY: Entry deleted - cartCode: {}, entryCode: {}", cartModel.getCode(), code);
    }

    @Override
    public Optional<CartEntryModel> findByProduct(String product) {
        log.debug("CART ENTRY: Finding entry by product - productCode: {}", product);
        return cartEntryRepository.findByProductAndOwner(product,UserUtil.current());
    }

    @Override
    public CartEntryModel saveCartEntry(CartEntryModel cartEntryModel) {
        log.debug("CART ENTRY: Saving entry - entryCode: {}", cartEntryModel.getCode());
        return cartEntryRepository.save(cartEntryModel);
    }
}
