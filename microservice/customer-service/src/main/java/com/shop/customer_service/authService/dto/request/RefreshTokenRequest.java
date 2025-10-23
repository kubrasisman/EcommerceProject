package com.shop.customer_service.authService.dto.request;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
}
