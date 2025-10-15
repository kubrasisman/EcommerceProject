package com.shop.order_service.order.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public abstract class AbstractOrderEntryModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productCode;
    private Integer quantity;
    private double basePrice;
    private double totalPrice;
    private Integer entryNumber;
    @Column(updatable = false)
    private LocalDateTime creationDate;

    @PrePersist
    protected void onCreate() {
        this.creationDate= LocalDateTime.now();
    }
}
