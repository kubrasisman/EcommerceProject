package com.shop.product_service.category.service.impl;

import com.shop.product_service.category.dto.CategoryDto;
import com.shop.product_service.category.dto.response.CategoryDtoResponse;
import com.shop.product_service.category.model.CategoryModel;
import com.shop.product_service.category.populator.CategoryPopulator;
import com.shop.product_service.category.repository.CategoryRepository;
import com.shop.product_service.category.service.CategoryService;
import com.shop.product_service.product.model.ProductModel;
import com.shop.product_service.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryPopulator categoryMapper;
    private final ProductRepository productRepository;

    @Override
    public List<CategoryDtoResponse> getAllCategories() {
        try {
            List<CategoryModel> categories = categoryRepository.findAll();
            if (CollectionUtils.isEmpty(categories)) {
                return Collections.emptyList();
            }
            return categories.stream()
                    .map(categoryMapper::toDtoResponse)
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            log.error("Failed to fetch all categories", ex);
            throw new RuntimeException("Could not fetch categories", ex);
        }
    }

    @Override
    public CategoryDtoResponse getCategoryByCode(Long code) {
        try {
            CategoryModel category = categoryRepository.findByCode(code)
                    .orElseThrow(() -> {
                        log.warn("Category not found with code: {}", code);
                        return new RuntimeException("Category not found with code: " + code);
                    });
            return categoryMapper.toDtoResponse(category);
        } catch (Exception ex) {
            log.error("Error while getting category by code: {}", code, ex);
            throw new RuntimeException("Error while getting category", ex);
        }
    }

    @Override
    @Transactional
    public CategoryDtoResponse createCategory(CategoryDto categoryDto) {
        if (categoryDto == null) {
            log.warn("createCategory called with null categoryDto");
            throw new IllegalArgumentException("Category data must not be null");
        }
        try {
            Long code = categoryDto.getCode();
            if (code != null && categoryRepository.existsByCode(code)) {
                log.warn("Category with code {} already exists", code);
                return categoryMapper.toDtoResponse(categoryRepository.findByCode(code).get());
            }

            CategoryModel categoryModel = categoryMapper.toModel(categoryDto);
            // handle products
            Set<Long> productCodes = categoryDto.getProductCodes();
            if (!CollectionUtils.isEmpty(productCodes)) {
                Set<ProductModel> products = new HashSet<>();
                productCodes.forEach(p -> {
                    try {
                        Optional<ProductModel> productModel = productRepository.findByCode(p);
                        productModel.ifPresent(products::add);
                    } catch (Exception ex) {
                        log.warn("Failed to load product with code {}. Skipping. Error: {}", p, ex);
                    }
                });
                if (!products.isEmpty()) {
                    categoryModel.setProducts(products);
                } else {
                    categoryModel.setProducts(Collections.emptySet());
                }
            } else {
                categoryModel.setProducts(Collections.emptySet());
            }

            categoryRepository.save(categoryModel);
            return categoryMapper.toDtoResponse(categoryModel);
        } catch (Exception ex) {
            log.error("Failed to create category", ex);
            throw new RuntimeException("Failed to create category", ex);
        }
    }

    @Override
    @Transactional
    public CategoryDtoResponse updateCategory(CategoryDto categoryDto) {
        if (categoryDto == null || categoryDto.getCode() == null) {
            log.warn("updateCategory called with null categoryDto or null code");
            throw new IllegalArgumentException("Category data and code must not be null");
        }
        Long code = categoryDto.getCode();
        try {
            CategoryModel category = categoryRepository.findByCode(code)
                    .orElseThrow(() -> {
                        log.warn("Category not found with code: {}", code);
                        return new RuntimeException("Category not found with code: " + code);
                    });

            category.setName(categoryDto.getName());
            category.setDescription(categoryDto.getDescription());
            category.setCode(categoryDto.getCode());

            // handle category updates
            if (categoryDto.getProductCodes() != null) {
                Set<Long> allProductCodes = categoryDto.getProductCodes();
                Set<Long> existingCodes = category.getProducts().stream().map(ProductModel::getCode).collect(Collectors.toSet());
                Set<Long> toAdd = allProductCodes.stream().filter(codeVal -> !existingCodes.contains(codeVal)).collect(Collectors.toSet());
                Set<Long> toRemove = existingCodes.stream().filter(codeVal -> !allProductCodes.contains(codeVal)).collect(Collectors.toSet());

                if (!toAdd.isEmpty()) {
                    Set<ProductModel> productsToAdd = new HashSet<>();
                    toAdd.forEach(p -> {
                        try {
                            Optional<ProductModel> productModel = productRepository.findByCode(p);
                            productModel.ifPresent(pm-> {
                                productModel.get().getCategories().add(category);  // <-- owning side
                                category.getProducts().add(pm);
                                productRepository.save(productModel.get());
                            });

                        } catch (Exception ex) {
                            log.warn("Failed to load product with code {} while updating. Skipping. Error: {}", p, ex);
                        }
                    });
                }

                if (!toRemove.isEmpty()) {
                    category.getProducts().removeIf(p -> toRemove.contains(p.getCode()));
                }
            }

            categoryRepository.save(category);
            return categoryMapper.toDtoResponse(category);
        } catch (Exception ex) {
            log.error("Failed to update category with code {}", code, ex);
            throw new RuntimeException("Failed to update category", ex);
        }
    }

    @Override
    @Transactional
    public boolean deleteCategory(Long code) {
        if (code == null) {
            log.warn("deleteCategory called with null code");
            throw new IllegalArgumentException("Category code must not be null");
        }
        try {
            if (!categoryRepository.existsByCode(code)) {
                log.info("Attempted to delete non-existing category with code {}", code);
                return false;
            }
            categoryRepository.deleteByCode(code);
            return true;
        } catch (Exception ex) {
            log.error("Failed to delete category with code {}", code, ex);
            throw new RuntimeException("Failed to delete category", ex);
        }
    }
}
