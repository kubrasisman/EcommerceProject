package com.shop.order_service.cart.dto.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class AddressDtoResponse implements Serializable {
    private CustomerDtoResponse owner;
    private String addressTitle;
    private String street;
    private String city;
    private String country;
    private String postalCode;
    private String phoneNumber;
}
