package com.shop.customer_service.addressService.repository;

import com.shop.customer_service.addressService.model.AddressModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<AddressModel, Long> {
    List<AddressModel> findAllByOwner_Id(Long ownerId);

}
