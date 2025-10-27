package com.shop.order_service.payment.dto;


import lombok.Data;

@Data
public class PaymentInfoDto {
    private String bankName;
    private PaymentTransactionData paymentTransaction;
}
