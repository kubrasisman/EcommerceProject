package com.shop.customer_service.addressService.controller;

import com.shop.customer_service.addressService.dto.AddressDto;
import com.shop.customer_service.addressService.dto.response.AddressDtoResponse;
import com.shop.customer_service.addressService.service.AddressService;
import com.shop.customer_service.common.utils.UserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/customers/address")
@RequiredArgsConstructor
public class AddressController {

     private final AddressService addressService;

    @GetMapping(value = "/{id}")
    public AddressDtoResponse getAddress(@PathVariable("id") Long code) {
        return addressService.getAddress(code);
    }

    @PostMapping
    public AddressDtoResponse createAddress(@RequestBody AddressDto addressDto){
        return addressService.createAddress(addressDto);
    }

    @GetMapping("/customer")
    public List<AddressDtoResponse> getAddresses(){
        return addressService.getAllAddressesByCustomer(UserUtil.current());
    }
}
