package com.shop.customer_service.userService.dto;

import lombok.Data;

@Data
public class CustomerDto {
    private Long id;
    private String email;
    private String password;
    private String fullName;
    private Boolean kvkkConsent;
    private Boolean emailValid;
}
