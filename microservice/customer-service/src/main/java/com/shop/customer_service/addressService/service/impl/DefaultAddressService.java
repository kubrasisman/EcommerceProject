package com.shop.customer_service.addressService.service.impl;

import com.shop.customer_service.addressService.dto.response.AddressDtoResponse;
import com.shop.customer_service.addressService.model.AddressModel;
import com.shop.customer_service.addressService.populator.AddressPopulator;
import com.shop.customer_service.addressService.repository.AddressRepository;
import com.shop.customer_service.addressService.service.AddressService;
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

    @Override
    public AddressDtoResponse getAddress(Long id) {
        AddressModel addressModel = addressRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Address not found with code: {}", id);
                    return new RuntimeException("Address not found with code: " + id);
                });;
        return addressPopulator.toResponseData(addressModel);
    }

    @Override
    public List<AddressDtoResponse> getAllAddresses() {
        return addressPopulator.toDataList(addressRepository.findAll());
    }

    @Override
    public List<AddressDtoResponse> getAllAddressesByCustomer(Long customerId) {
        return addressPopulator.toDataList(addressRepository.findAllByOwner_Id(customerId));
    }
}
