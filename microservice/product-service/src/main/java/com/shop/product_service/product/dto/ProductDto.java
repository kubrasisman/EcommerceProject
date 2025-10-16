package com.shop.product_service.product.dto;

import lombok.Data;

import java.util.Set;

@Data
public class ProductDto {
    private Long id;
    private Long code;
    private String name;
    private String title;
    private String description;
    private String brand;
    private double price;
    private String imageUrl;
    private Set<Long> categoryCodes;
}
