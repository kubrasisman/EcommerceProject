package com.shop.order_service.order.repository;

import com.shop.order_service.order.model.OrderModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderModel,Long> {
    Optional<OrderModel> findByCode(String code);
    List<OrderModel> findByOwner(String owner);
}
