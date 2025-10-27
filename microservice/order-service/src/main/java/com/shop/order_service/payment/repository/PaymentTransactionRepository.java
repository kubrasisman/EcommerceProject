package com.shop.order_service.payment.repository;

import com.shop.order_service.payment.model.PaymentTransactionModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PaymentTransactionRepository extends JpaRepository<PaymentTransactionModel, Long> {
    Optional<PaymentTransactionModel> findByOrderCode(String orderCode);
}
