package com.shop.product_service.category.dto;

import lombok.Data;

import java.util.Set;

@Data
public class CategoryData {
    private Long id;
    private Long code;
    private String name;
    private String description;
    private Set<Long> productCodes;
}
