package com.shop.order_service.cart.repository;

import com.shop.order_service.cart.model.CartModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartModel,Long> {
    Optional<CartModel> findByCode(String code);

}
