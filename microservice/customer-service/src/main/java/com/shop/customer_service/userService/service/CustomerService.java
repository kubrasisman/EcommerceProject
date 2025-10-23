package com.shop.customer_service.userService.service;

import com.shop.customer_service.userService.dto.response.CustomerDtoResponse;

public interface CustomerService {

    CustomerDtoResponse getCustomer(String id);
}
