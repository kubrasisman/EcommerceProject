package com.shop.order_service.order.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
public abstract class AbstractOrderEntryModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String product;
    private String code;
    private Integer quantity;
    private double basePrice;
    private double totalPrice;
    @Column(updatable = false)
    private LocalDateTime creationDate;

    @Column(name = "owner")
    private String owner;

    @PrePersist
    protected void onCreate() {
        this.creationDate= LocalDateTime.now();
    }
}
