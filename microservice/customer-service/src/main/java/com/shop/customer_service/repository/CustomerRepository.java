package com.shop.customer_service.repository;

import com.shop.customer_service.model.CustomerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerModel, Long> {
    CustomerModel findByEmail(String email);
    CustomerModel findByEmailAndActive(String email,Boolean active);
}
