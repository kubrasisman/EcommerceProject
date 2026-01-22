package com.shop.product_service.banner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "p_banner")
@Getter
@Setter
public class BannerModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long code;

    private String title;

    private String description;

    private String imageUrl;

    private String linkUrl;

    private Integer displayOrder;

    private Boolean active;
}
