package com.shop.customer_service.addressService.dto.response;

import com.shop.customer_service.userService.dto.response.CustomerDtoResponse;
import lombok.Data;

import java.io.Serializable;

@Data
public class AddressDtoResponse implements Serializable {
    private Long id;
    private CustomerDtoResponse owner;
    private String addressTitle;
    private String street;
    private String city;
    private String country;
    private String postalCode;
    private String phoneNumber;
}
