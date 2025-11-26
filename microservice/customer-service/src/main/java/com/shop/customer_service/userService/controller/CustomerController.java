package com.shop.customer_service.userService.controller;

import com.shop.customer_service.common.utils.UserUtil;
import com.shop.customer_service.userService.dto.response.CustomerDtoResponse;
import com.shop.customer_service.userService.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public CustomerDtoResponse getCustomer() {
        return customerService.getCustomer(UserUtil.current());
    }
}
