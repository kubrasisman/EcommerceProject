package com.shop.order_service.cart.populator;

import com.shop.order_service.cart.dto.request.CartDto;
import com.shop.order_service.cart.dto.response.CartEntryDtoResponse;
import com.shop.order_service.cart.dto.response.CartDtoResponse;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.common.populator.CommonPopulator;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class CartPopulator extends CommonPopulator {

    @Mapping(target = "address", expression = "java(findAddress(model.getAddress()))")
    public abstract CartDtoResponse toResponseDto(CartModel model);
    public abstract CartModel toModel(CartDto data);
    @Mapping(target = "product", expression = "java(findProduct(entry.getProduct()))")
    public abstract CartEntryDtoResponse toEntryResponseDto(CartEntryModel entry);
    public abstract List<CartEntryDtoResponse> toEntryResponseDtoList(List<CartEntryModel> entries);

}
