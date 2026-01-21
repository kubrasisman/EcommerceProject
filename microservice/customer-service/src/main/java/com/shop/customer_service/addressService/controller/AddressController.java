package com.shop.customer_service.addressService.controller;

import com.shop.customer_service.addressService.dto.AddressDto;
import com.shop.customer_service.addressService.dto.response.AddressDtoResponse;
import com.shop.customer_service.addressService.service.AddressService;
import com.shop.customer_service.common.utils.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/customers/address")
@RequiredArgsConstructor
@Slf4j
public class AddressController {

     private final AddressService addressService;

    @GetMapping(value = "/{id}")
    public AddressDtoResponse getAddress(@PathVariable("id") Long code) {
        log.info("Request received: GET /api/customers/address/{}", code);
        AddressDtoResponse response = addressService.getAddress(code);
        log.info("Request completed: GET /api/customers/address/{} - Status: 200", code);
        return response;
    }

    @PostMapping
    public AddressDtoResponse createAddress(@RequestBody AddressDto addressDto){
        log.info("Request received: POST /api/customers/address - city: {}", addressDto.getCity());
        AddressDtoResponse response = addressService.createAddress(addressDto);
        log.info("Request completed: POST /api/customers/address - Status: 200, addressId: {}", response.getId());
        return response;
    }

    @GetMapping("/customer")
    public List<AddressDtoResponse> getAddresses(){
        log.info("Request received: GET /api/customers/address/customer");
        List<AddressDtoResponse> response = addressService.getAllAddressesByCustomer(UserUtil.current());
        log.info("Request completed: GET /api/customers/address/customer - Status: 200, count: {}", response.size());
        return response;
    }
}
