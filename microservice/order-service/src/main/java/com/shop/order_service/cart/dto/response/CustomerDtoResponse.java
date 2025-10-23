package com.shop.order_service.cart.dto.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class CustomerDtoResponse implements Serializable {
    private Long id;
    private String email;
    private String fullName;
    private Boolean kvkkConsent;
    private Boolean emailValid;
}
