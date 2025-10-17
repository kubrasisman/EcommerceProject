package com.shop.product_service.category.controller;

import com.shop.product_service.category.dto.CategoryDto;
import com.shop.product_service.category.dto.response.CategoryDtoResponse;
import com.shop.product_service.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping(value = "/{id}")
    public CategoryDtoResponse getCategory(@PathVariable Long code) {
        return categoryService.getCategoryByCode(code);
    }

    @GetMapping
    public List<CategoryDtoResponse> getCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping(value = "/save")
    public CategoryDtoResponse saveCategory(@RequestBody CategoryDto categoryDto) {
        return categoryService.createCategory(categoryDto);
    }

    @PostMapping(value = "/update")
    public CategoryDtoResponse updateCategory(@RequestBody CategoryDto categoryDto) {
        return categoryService.updateCategory(categoryDto);
    }

    @DeleteMapping(value = "remove/{id}")
    public boolean deleteCategory(@PathVariable Long id){
        return categoryService.deleteCategory(id);
    }
}
