package com.shop.customer_service.userService.service.impl;

import com.shop.customer_service.userService.dto.response.CustomerDtoResponse;
import com.shop.customer_service.userService.model.CustomerModel;
import com.shop.customer_service.userService.populator.CustomerPopulator;
import com.shop.customer_service.userService.repository.CustomerRepository;
import com.shop.customer_service.userService.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DefaultCustomerService implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerPopulator customerPopulator;

    @Override
    public CustomerDtoResponse getCustomer(String email) {
        CustomerModel customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        return customerPopulator.toResponseData(customer);
    }
}
