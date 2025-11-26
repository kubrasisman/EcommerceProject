package com.shop.customer_service.addressService.controller;

import com.shop.customer_service.addressService.dto.response.AddressDtoResponse;
import com.shop.customer_service.addressService.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/address")
@RequiredArgsConstructor
public class AddressController {

     private final AddressService addressService;

    @GetMapping(value = "/{id}")
    public AddressDtoResponse getAddress(@PathVariable("id") Long code) {
        return addressService.getAddress(code);
    }
}
