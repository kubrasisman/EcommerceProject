package com.shop.customer_service.authService.dto.request;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
