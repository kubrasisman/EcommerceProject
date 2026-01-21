package com.shop.product_service.category.controller;

import com.shop.product_service.category.dto.CategoryDto;
import com.shop.product_service.category.dto.response.CategoryDtoResponse;
import com.shop.product_service.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping(value = "/{id}")
    public CategoryDtoResponse getCategory(@PathVariable Long code) {
        log.info("Request received: GET /api/categories/{}", code);
        CategoryDtoResponse response = categoryService.getCategoryByCode(code);
        log.info("Request completed: GET /api/categories/{} - Status: 200", code);
        return response;
    }

    @GetMapping
    public List<CategoryDtoResponse> getCategories() {
        log.info("Request received: GET /api/categories");
        List<CategoryDtoResponse> response = categoryService.getAllCategories();
        log.info("Request completed: GET /api/categories - Status: 200, count: {}", response.size());
        return response;
    }

    @PostMapping(value = "/save")
    public CategoryDtoResponse saveCategory(@RequestBody CategoryDto categoryDto) {
        log.info("Request received: POST /api/categories/save - categoryName: {}", categoryDto.getName());
        CategoryDtoResponse response = categoryService.createCategory(categoryDto);
        log.info("Request completed: POST /api/categories/save - Status: 200, categoryCode: {}", response.getCode());
        return response;
    }

    @PostMapping(value = "/update")
    public CategoryDtoResponse updateCategory(@RequestBody CategoryDto categoryDto) {
        log.info("Request received: POST /api/categories/update - categoryCode: {}", categoryDto.getCode());
        CategoryDtoResponse response = categoryService.updateCategory(categoryDto);
        log.info("Request completed: POST /api/categories/update - Status: 200, categoryCode: {}", response.getCode());
        return response;
    }

    @DeleteMapping(value = "remove/{id}")
    public boolean deleteCategory(@PathVariable Long id){
        log.info("Request received: DELETE /api/categories/remove/{}", id);
        boolean result = categoryService.deleteCategory(id);
        log.info("Request completed: DELETE /api/categories/remove/{} - Status: 200, success: {}", id, result);
        return result;
    }
}
