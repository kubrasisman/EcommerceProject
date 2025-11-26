package com.shop.customer_service.addressService.service;

import com.shop.customer_service.addressService.dto.response.AddressDtoResponse;

import java.util.List;

public interface AddressService {
    AddressDtoResponse getAddress(Long id);
    List<AddressDtoResponse> getAllAddresses();
    List<AddressDtoResponse> getAllAddressesByCustomer(Long customerId);
}
