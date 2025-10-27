package com.shop.order_service.payment.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "p_paymentInfo")
@Data
public class PaymentInfoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bankName;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "paymentInfo")
    private PaymentTransactionModel paymentTransaction;

}
