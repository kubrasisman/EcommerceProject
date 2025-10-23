package com.shop.customer_service.addressService.model;

import com.shop.customer_service.userService.model.CustomerModel;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "p_address")
@Data
public class AddressModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String addressTitle;
    private String street;
    private String city;
    private String country;
    private String postalCode;
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private CustomerModel owner;
}
