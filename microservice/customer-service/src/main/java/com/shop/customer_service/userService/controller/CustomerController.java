package com.shop.customer_service.userService.controller;

import com.shop.customer_service.common.logging.LogMaskingUtil;
import com.shop.customer_service.common.utils.UserUtil;
import com.shop.customer_service.userService.dto.response.CustomerDtoResponse;
import com.shop.customer_service.userService.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public CustomerDtoResponse getCustomer() {
        String currentUser = UserUtil.current();
        log.info("Request received: GET /api/customers - email: {}", LogMaskingUtil.maskEmail(currentUser));
        CustomerDtoResponse response = customerService.getCustomer(currentUser);
        log.info("Request completed: GET /api/customers - Status: 200, customerId: {}", response.getId());
        return response;
    }
}
