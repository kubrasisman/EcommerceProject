package com.shop.order_service.cart.repository;

import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartEntryRepository extends JpaRepository<CartEntryModel,Long> {
    Optional<CartEntryModel> findByCode(String code);
    Optional<CartEntryModel> findByOwner(String owner);
    Optional<CartEntryModel> findByOwnerAndCode(String owner,String code);
    Optional<CartEntryModel> findByProduct(String product);
}
