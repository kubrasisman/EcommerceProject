package com.shop.order_service.payment.repository;

import com.shop.order_service.payment.model.PaymentInfoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentInfoRepository extends JpaRepository<PaymentInfoModel, Long> {
}
