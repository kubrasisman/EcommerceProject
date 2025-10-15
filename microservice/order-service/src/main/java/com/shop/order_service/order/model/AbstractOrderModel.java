package com.shop.order_service.order.model;

import com.shop.order_service.address.model.AddressModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public class AbstractOrderModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private double totalPrice;
    private String customerEmail;
    @Column(updatable = false)
    private LocalDateTime creationDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private AddressModel address; //todo json string dön


    @PrePersist
    protected void onCreate() {
        this.creationDate= LocalDateTime.now();
    }


}
