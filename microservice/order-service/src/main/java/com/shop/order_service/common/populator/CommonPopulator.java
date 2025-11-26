package com.shop.order_service.common.populator;

import com.shop.order_service.cart.dto.response.AddressDtoResponse;
import com.shop.order_service.cart.dto.response.CustomerDtoResponse;
import com.shop.order_service.common.client.CustomerServiceClient;
import com.shop.order_service.common.client.ProductServiceClient;
import com.shop.order_service.common.dto.response.ProductDtoResponse;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class CommonPopulator {
    @Autowired
    private ProductServiceClient productServiceClient;
    @Autowired
    private CustomerServiceClient customerServiceClient;

    protected CustomerDtoResponse findCustomer(String owner) {return customerServiceClient.getCustomer();}
    protected AddressDtoResponse findAddress(Long address) {return address!= null ? customerServiceClient.getAddress(address) : null;}
    protected ProductDtoResponse findProduct(String product){
        return productServiceClient.getProduct(product);
    }

    protected String map(ProductDtoResponse productDto) {return productDto != null ? productDto.getCode() : null;}

    protected String map(CustomerDtoResponse customerDto) {return customerDto != null ? customerDto.getEmail() : null;}


}
