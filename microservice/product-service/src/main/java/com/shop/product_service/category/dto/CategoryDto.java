package com.shop.product_service.category.dto;

import com.shop.product_service.category.model.CategoryType;
import lombok.Data;

import java.util.Set;

@Data
public class CategoryDto {
    private Long id;
    private Long code;
    private String name;
    private String description;
    private Set<Long> parentCategoryCodes;
    private Set<Long> productCodes;
    private CategoryType type = CategoryType.CATEGORY;
}
