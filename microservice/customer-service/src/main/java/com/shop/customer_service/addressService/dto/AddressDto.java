package com.shop.customer_service.addressService.dto;

import lombok.Data;

@Data
public class AddressDto {
    private Long owner;
    private String addressTitle;
    private String street;
    private String city;
    private String country;
    private String postalCode;
    private String phoneNumber;
}
