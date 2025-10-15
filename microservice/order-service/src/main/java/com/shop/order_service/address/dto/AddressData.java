package com.shop.order_service.address.dto;

import lombok.Data;

@Data
public class AddressData {
    private Long id;
    private String addressTitle;
    private String street;
    private String city;
    private String country;
    private String postalCode;
    private String phoneNumber;
}
