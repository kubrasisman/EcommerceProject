package com.shop.customer_service.userService.service;

import com.shop.customer_service.userService.dto.response.CustomerDtoResponse;
import com.shop.customer_service.userService.model.CustomerModel;

public interface CustomerService {

    CustomerDtoResponse getCustomer(String id);
    CustomerModel getCurrentCustomer();
}
