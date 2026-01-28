package com.shop.product_service.category.dto.response;

import com.shop.product_service.category.model.CategoryType;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

@Data
public class CategoryDtoResponse implements Serializable {
    private Long id;
    private Long code;
    private String name;
    private String description;
    private Set<Long> parentCategoryCodes;
    private CategoryType type;
    private List<CategoryDtoResponse> children;
    private Set<Long> productCodes;
}
