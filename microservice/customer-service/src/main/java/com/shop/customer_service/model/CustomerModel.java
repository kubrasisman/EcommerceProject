package com.shop.customer_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "p_customers")
@Data
public class CustomerModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(updatable = false)
    private LocalDateTime creationDate;
    private String email;
    private String password;
    private Boolean active = true;
    private String fullName;
    private Boolean kvkkConsent = false;
    private Boolean emailValid = false;

    @PrePersist
    protected void onCreate() {
        this.creationDate= LocalDateTime.now();
    }
}
