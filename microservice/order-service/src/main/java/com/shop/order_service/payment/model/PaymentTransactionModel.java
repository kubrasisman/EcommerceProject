package com.shop.order_service.payment.model;

import com.shop.order_service.order.model.OrderModel;
import com.shop.order_service.payment.type.PaymentMethod;
import com.shop.order_service.payment.type.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "p_paymentTransaction")
@Data
public class PaymentTransactionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private OrderModel order;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private double amount;
    private PaymentStatus status;
    @OneToOne(mappedBy = "paymentTransaction", cascade = CascadeType.ALL)
    private PaymentInfoModel paymentInfo;
    private LocalDateTime creationDate;

    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
    }
}
