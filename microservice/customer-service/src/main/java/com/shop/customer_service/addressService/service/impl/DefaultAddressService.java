package com.shop.customer_service.addressService.service.impl;

import com.shop.customer_service.addressService.dto.AddressDto;
import com.shop.customer_service.addressService.dto.response.AddressDtoResponse;
import com.shop.customer_service.addressService.model.AddressModel;
import com.shop.customer_service.addressService.populator.AddressPopulator;
import com.shop.customer_service.addressService.repository.AddressRepository;
import com.shop.customer_service.addressService.service.AddressService;
import com.shop.customer_service.userService.model.CustomerModel;
import com.shop.customer_service.userService.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultAddressService implements AddressService {

    private final AddressRepository addressRepository;
    private final AddressPopulator addressPopulator;
    private final CustomerService customerService;

    @Override
    public AddressDtoResponse getAddress(Long id) {
        CustomerModel currentCustomer = customerService.getCurrentCustomer();
        AddressModel addressModel = addressRepository.findByIdAndOwner(id, currentCustomer)
                .orElseThrow(() -> {
                    log.warn("Address not found with code: {}", id);
                    return new RuntimeException("Address not found with code: " + id);
                });
        return addressPopulator.toResponseData(addressModel);
    }

    @Override
    public List<AddressDtoResponse> getAllAddresses() {
        return addressPopulator.toDataList(addressRepository.findAll());
    }

    @Override
    public List<AddressDtoResponse> getAllAddressesByCustomer(String email) {
        CustomerModel currentCustomer = customerService.getCurrentCustomer();
        return addressPopulator.toDataList(addressRepository.findByOwner(currentCustomer));
    }

    @Override
    public AddressDtoResponse createAddress(AddressDto addressDto) {
        AddressModel addressModel = addressPopulator.toModel(addressDto);
        AddressModel savedAddressModel = addressRepository.save(addressModel);
        return addressPopulator.toResponseData(savedAddressModel);
    }

}
