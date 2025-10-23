package com.shop.customer_service.userService.model;

import com.shop.customer_service.addressService.model.AddressModel;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;

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

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private List<AddressModel> addressModels;

    @PrePersist
    protected void onCreate() {
        this.creationDate= LocalDateTime.now();
    }
}
