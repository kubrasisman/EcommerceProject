package com.shop.order_service.payment.dto;

import com.shop.order_service.payment.type.PaymentMethod;
import com.shop.order_service.payment.type.PaymentStatus;
import lombok.Data;

@Data
public class PaymentTransactionData {
    private String order;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private double amount;
    private PaymentStatus status;
    private PaymentInfoDto paymentInfo;
}
