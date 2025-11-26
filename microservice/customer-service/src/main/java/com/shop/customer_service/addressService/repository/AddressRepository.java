package com.shop.customer_service.addressService.repository;

import com.shop.customer_service.addressService.model.AddressModel;
import com.shop.customer_service.userService.model.CustomerModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<AddressModel, Long> {
    List<AddressModel> findAllByOwner_Id(Long ownerId);
    List<AddressModel> findByOwner(CustomerModel owner);
    Optional<AddressModel> findByIdAndOwner(Long id, CustomerModel owner);
}
