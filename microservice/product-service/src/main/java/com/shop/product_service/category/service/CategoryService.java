package com.shop.product_service.category.service;

import com.shop.product_service.category.dto.CategoryData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    List<CategoryData> getAllCategories();
    CategoryData getCategoryByCode(Long code);
    CategoryData createCategory(CategoryData categoryData);
    CategoryData updateCategory(Long code, CategoryData categoryData);
    void deleteCategory(Long code);
}
