package com.shop.customer_service.populator;

import com.shop.customer_service.dto.CustomerData;
import com.shop.customer_service.model.CustomerModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerPopulator {
    CustomerData toData(CustomerModel customerModel);
    CustomerModel toModel(CustomerData customerData);
}
