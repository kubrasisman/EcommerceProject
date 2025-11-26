package com.shop.order_service.payment.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "p_paymentTransaction")
@Data
public class PaymentTransactionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentMethod; //todo make it enum
    private String transactionId;
    private double amount;
    private String status;//todo make it enum
}
