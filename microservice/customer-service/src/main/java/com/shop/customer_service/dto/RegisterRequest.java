package com.shop.customer_service.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private Boolean kvkkConsent;
}
