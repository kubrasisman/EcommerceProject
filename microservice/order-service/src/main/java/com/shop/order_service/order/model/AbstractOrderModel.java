package com.shop.order_service.order.model;

import com.shop.order_service.payment.type.PaymentMethod;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
public class AbstractOrderModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private double totalPrice;

    @Column(updatable = false)
    private LocalDateTime creationDate;
    private LocalDateTime updateDate;
    private Long address;
    @Column(name = "owner")
    private String owner;
    @Enumerated(EnumType.STRING)
    @Column(length = 255, nullable = true)
    private PaymentMethod paymentMethod;

    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateDate = LocalDateTime.now();
    }


}
