package com.shop.customer_service.addressService.populator;

import com.shop.customer_service.addressService.dto.AddressDto;
import com.shop.customer_service.addressService.dto.response.AddressDtoResponse;
import com.shop.customer_service.addressService.model.AddressModel;
import com.shop.customer_service.userService.model.CustomerModel;
import com.shop.customer_service.userService.repository.CustomerRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class AddressPopulator {

    @Autowired
    protected CustomerRepository customerRepository;

    @Mapping(target = "owner", expression = "java(findCustomer(addressData.getOwner()))")
    public abstract AddressModel toModel(AddressDto addressData);
    public abstract AddressDtoResponse toResponseData(AddressModel address);
    public abstract List<AddressDtoResponse> toDataList(List<AddressModel> addresses);

    protected CustomerModel findCustomer(Long id) {return customerRepository.findById(id).get();}
}
