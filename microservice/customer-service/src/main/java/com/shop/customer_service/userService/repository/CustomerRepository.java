package com.shop.customer_service.userService.repository;

import com.shop.customer_service.userService.model.CustomerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerModel, Long> {
    Optional<CustomerModel> findByEmail(String email);
    CustomerModel findByEmailAndActive(String email,Boolean active);
}
