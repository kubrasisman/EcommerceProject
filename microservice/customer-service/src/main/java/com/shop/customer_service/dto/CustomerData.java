package com.shop.customer_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CustomerData {
    private Long id;
    private LocalDateTime creationDate;
    private String email;
    private String password;
    private String fullName;
    private Boolean kvkkConsent;
    private Boolean emailValid;
}
