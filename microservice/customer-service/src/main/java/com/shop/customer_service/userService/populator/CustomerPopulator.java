package com.shop.customer_service.userService.populator;

import com.shop.customer_service.userService.dto.CustomerDto;
import com.shop.customer_service.userService.dto.response.CustomerDtoResponse;
import com.shop.customer_service.userService.model.CustomerModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerPopulator {
    CustomerDto toData(CustomerModel customerModel);
    CustomerModel toModel(CustomerDto customerData);
    CustomerDtoResponse toResponseData(CustomerModel customerModel);
}
