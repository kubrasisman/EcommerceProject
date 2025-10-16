package com.shop.product_service.category.service;

import com.shop.product_service.category.dto.CategoryDto;
import com.shop.product_service.category.dto.response.CategoryDtoResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryDtoResponse> getAllCategories();
    CategoryDtoResponse getCategoryByCode(Long code);
    CategoryDtoResponse createCategory(CategoryDto categoryData);
    CategoryDtoResponse updateCategory(CategoryDto categoryData);
    boolean deleteCategory(Long code);
}
