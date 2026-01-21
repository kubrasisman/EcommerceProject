package com.shop.customer_service.userService.service.impl;

import com.shop.customer_service.common.logging.LogMaskingUtil;
import com.shop.customer_service.common.logging.MdcContextUtil;
import com.shop.customer_service.common.utils.UserUtil;
import com.shop.customer_service.userService.dto.response.CustomerDtoResponse;
import com.shop.customer_service.userService.model.CustomerModel;
import com.shop.customer_service.userService.populator.CustomerPopulator;
import com.shop.customer_service.userService.repository.CustomerRepository;
import com.shop.customer_service.userService.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultCustomerService implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerPopulator customerPopulator;

    @Override
    public CustomerDtoResponse getCustomer(String email) {
        String maskedEmail = LogMaskingUtil.maskEmail(email);
        log.info("CUSTOMER: Fetching customer by email: {}", maskedEmail);

        CustomerModel customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("CUSTOMER: Customer not found - email: {}", maskedEmail);
                    return new RuntimeException("Invalid credentials");
                });

        MdcContextUtil.setCustomerContext(customer.getId());
        log.info("CUSTOMER: Customer found - customerId: {}", customer.getId());
        return customerPopulator.toResponseData(customer);
    }

    @Override
    public CustomerModel getCurrentCustomer() {
        String currentUser = UserUtil.current();
        log.debug("CUSTOMER: Fetching current customer - email: {}", LogMaskingUtil.maskEmail(currentUser));

        return customerRepository.findByEmail(currentUser)
                .orElseThrow(() -> {
                    log.warn("CUSTOMER: Current customer not found - email: {}", LogMaskingUtil.maskEmail(currentUser));
                    return new RuntimeException("Invalid User");
                });
    }
}
