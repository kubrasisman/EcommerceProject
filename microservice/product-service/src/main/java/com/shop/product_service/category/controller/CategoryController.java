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

    // ==================== Hierarchy Endpoints ===================
    @GetMapping("/hierarchy")
    public List<CategoryDtoResponse> getCategoryHierarchy() {
        log.info("Request received: GET /api/categories/hierarchy");
        List<CategoryDtoResponse> response = categoryService.getCategoryHierarchy();
        log.info("Request completed: GET /api/categories/hierarchy - Status: 200, root count: {}", response.size());
        return response;
    }

    @GetMapping("/{code}/descendant-codes")
    public List<Long> getDescendantCodes(@PathVariable Long code) {
        log.info("Request received: GET /api/categories/{}/descendant-codes", code);
        List<Long> response = categoryService.getAllDescendantCodes(code);
        log.info("Request completed: GET /api/categories/{}/descendant-codes - Status: 200, count: {}", code, response.size());
        return response;
    }

    // ==================== Brand Endpoints ====================
    @GetMapping("/brands")
    public List<CategoryDtoResponse> getBrands() {
        log.info("Request received: GET /api/categories/brands");
        List<CategoryDtoResponse> response = categoryService.getBrands();
        log.info("Request completed: GET /api/categories/brands - Status: 200, count: {}", response.size());
        return response;
    }
}
