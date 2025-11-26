package com.shop.order_service.cart.populator;

import com.shop.order_service.cart.dto.request.CartDto;
import com.shop.order_service.cart.dto.response.AddressDtoResponse;
import com.shop.order_service.cart.dto.response.CartEntryDtoResponse;
import com.shop.order_service.cart.dto.response.CartDtoResponse;
import com.shop.order_service.cart.dto.response.CustomerDtoResponse;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.common.client.CustomerServiceClient;
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
    @Autowired
    private CustomerServiceClient customerServiceClient;

    @Mapping(target = "address", expression = "java(findAddress(model.getAddress()))")
    public abstract CartDtoResponse toData(CartModel model);
    public abstract CartModel toModel(CartDto data);
    @Mapping(target = "product", expression = "java(findProduct(entry.getProduct()))")
    public abstract CartEntryDtoResponse toEntryData(CartEntryModel entry);
    public abstract List<CartEntryDtoResponse> toEntryDataList(List<CartEntryModel> entries);

    protected ProductDtoResponse findProduct(Long product){
        return productServiceClient.getProduct(product);
    }

    protected AddressDtoResponse findAddress(Long address) {
        return address!= null ? customerServiceClient.getAddress(address) : null;
    }

    protected Long map(ProductDtoResponse productDto) {return productDto != null ? productDto.getId() : null;}
    protected String map(CustomerDtoResponse customerDto) {return customerDto != null ? customerDto.getEmail() : null;}
    protected CustomerDtoResponse findCustomer(String ownerId) {return customerServiceClient.getCustomer(ownerId);}

}
