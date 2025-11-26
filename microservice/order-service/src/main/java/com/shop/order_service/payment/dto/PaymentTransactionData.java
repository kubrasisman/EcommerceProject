package com.shop.order_service.payment.dto;

import lombok.Data;

@Data
public class PaymentTransactionData {
    private Long id;
    private String paymentMethod; // todo ileride enum olabilir
    private String transactionId;
    private double amount;
    private String status; // todo ileride enum olabilir
}
