package com.shop.order_service.cart.service.impl;

import com.shop.order_service.cart.repository.CartRepository;
import com.shop.order_service.common.client.ProductServiceClient;
import com.shop.order_service.common.dto.response.ProductDtoResponse;
import com.shop.order_service.common.utils.UserUtil;
import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.repository.CartEntryRepository;
import com.shop.order_service.cart.service.CartEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DefaultCartEntryService implements CartEntryService {
    private final CartEntryRepository cartEntryRepository;
    private final ProductServiceClient productServiceClient;
    private final CartRepository cartRepository;
    @Override
    public CartEntryModel addCartEntry(CartEntryDto cartEntryDto) {
        Optional<CartEntryModel> cartEntryModelOptional = cartEntryRepository.findByOwnerAndCode(UserUtil.current(), cartEntryDto.getCode());
        if (cartEntryModelOptional.isPresent()){
            return cartEntryModelOptional.get();
        }

        ProductDtoResponse product = productServiceClient.getProduct(cartEntryDto.getProduct());

        CartEntryModel cartEntryModel = new CartEntryModel();
        cartEntryModel.setCode(UUID.randomUUID().toString());
        cartEntryModel.setBasePrice(product.getPrice());
        cartEntryModel.setQuantity(cartEntryDto.getQuantity());
        cartEntryModel.setTotalPrice(0D);
        cartEntryModel.setProduct(product.getCode());
        cartEntryModel.setOwner(UserUtil.current());
        cartEntryModel.setCart(cartRepository.findByOwner(UserUtil.current()).orElseThrow(RuntimeException::new));

        return cartEntryRepository.save(cartEntryModel);
    }

    @Override
    public CartEntryModel updateCartEntry(CartEntryDto cartEntryDto) {
        Optional<CartEntryModel> cartEntryModelOptional = cartEntryRepository.findByOwnerAndCode(UserUtil.current(), cartEntryDto.getCode());
        if (cartEntryModelOptional.isEmpty()){
            throw new RuntimeException("Cannot Find Cart Entry");
        }

        ProductDtoResponse product = productServiceClient.getProduct(cartEntryDto.getProduct());
        CartEntryModel cartEntryModel = cartEntryModelOptional.get();
        cartEntryModel.setBasePrice(product.getPrice());
        cartEntryModel.setQuantity(cartEntryDto.getQuantity());

        return cartEntryRepository.save(cartEntryModel);
    }

    @Override
    public void deleteCartEntry(String code) {
        Optional<CartEntryModel> cartEntryModelOptional = cartEntryRepository.findByOwnerAndCode(UserUtil.current(), code);
        if (cartEntryModelOptional.isEmpty()){
            throw new RuntimeException("Entry Not Found");
        }
        cartEntryRepository.delete(cartEntryModelOptional.get());
    }

    @Override
    public Optional<CartEntryModel> findByProduct(String product) {
        return cartEntryRepository.findByProductAndOwner(product,UserUtil.current());
    }

    @Override
    public CartEntryModel saveCartEntry(CartEntryModel cartEntryModel) {
        return cartEntryRepository.save(cartEntryModel);
    }
}
