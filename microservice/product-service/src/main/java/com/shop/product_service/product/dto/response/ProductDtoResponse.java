package com.shop.product_service.product.dto.response;

import com.shop.product_service.category.dto.response.CategoryDtoResponse;
import lombok.Data;

import java.util.Set;

@Data
public class ProductDtoResponse {
    private Long id;
    private Long code;
    private String name;
    private String title;
    private String description;
    private String brand;
    private double price;
    private String imageUrl;
    private Set<CategoryDtoResponse> categoryCodes;
}
