package com.shop.order_service.address.model;

import jakarta.persistence.*;
import lombok.Data;

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
}
