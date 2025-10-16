package com.shop.product_service.category.dto.response;

import lombok.Data;

import java.util.Set;

@Data
public class CategoryDtoResponse {
    private Long id;
    private Long code;
    private String name;
    private String description;
    private Set<Long> productCodes;
}
