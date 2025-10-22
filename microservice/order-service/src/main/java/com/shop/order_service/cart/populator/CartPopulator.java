package com.shop.order_service.cart.populator;

import com.shop.order_service.cart.dto.CartData;
import com.shop.order_service.cart.dto.CartEntryData;
import com.shop.order_service.cart.dto.request.CartEntryDto;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.common.client.ProductServiceClient;
import com.shop.order_service.common.dto.response.ProductDtoResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class CartPopulator {
    @Autowired
    private ProductServiceClient productServiceClient;
    public abstract CartData toData(CartModel model);
   // public abstract CartModel toModel(CartData data);
    //public abstract CartEntryModel toEntryModel(CartEntryDto entryData);
    @Mapping(target = "product", expression = "java(findProduct(entry.getProduct()))")
    public abstract CartEntryData toEntryData(CartEntryModel entry);
    public abstract List<CartEntryData> toEntryDataList(List<CartEntryModel> entries);
    //public abstract List<CartEntryModel> toEntryModelList(List<CartEntryData> entries);

    protected ProductDtoResponse findProduct(Long product){
        return productServiceClient.getProduct(product);
    }
}
