package com.shop.product_service.category.service.impl;

import com.shop.product_service.category.dto.CategoryData;
import com.shop.product_service.category.model.CategoryModel;
import com.shop.product_service.category.populator.CategoryPopulator;
import com.shop.product_service.category.repository.CategoryRepository;
import com.shop.product_service.category.service.CategoryService;
import com.shop.product_service.product.model.ProductModel;
import com.shop.product_service.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryPopulator categoryMapper;
    private final ProductRepository productRepository;

    @Override
    public List<CategoryData> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toData)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryData getCategoryByCode(Long code) {
        CategoryModel category = categoryRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Category not found with code: " + code));
        return categoryMapper.toData(category);
    }

    @Override
    public CategoryData createCategory(CategoryData categoryData) {
        CategoryModel category = categoryMapper.toModel(categoryData);
        if (categoryData.getProductCodes() != null && !categoryData.getProductCodes().isEmpty()) {
            Set<ProductModel> products = new HashSet<>();
            categoryData.getProductCodes().forEach(p -> {
                Optional<ProductModel> productModel = productRepository.findByCode(p);
                if (productModel.isPresent()) {
                    products.add(productModel.get());
                }
            });
            category.setProducts(products);
        }
        categoryRepository.save(category);
        return categoryMapper.toData(category);
    }

    @Override
    public CategoryData updateCategory(Long code, CategoryData categoryData) {
        Optional<CategoryModel> optional = categoryRepository.findByCode(code);
        if (optional.isEmpty()) {
            throw new RuntimeException("Category not found with code: " + code);
        }

        CategoryModel category = optional.get();
        category.setName(categoryData.getName());
        category.setDescription(categoryData.getDescription());
        category.setCode(categoryData.getCode());

        if (categoryData.getProductCodes() != null) {
            Set<ProductModel> products = new HashSet<>();
            categoryData.getProductCodes().forEach(p -> {
                Optional<ProductModel> productModel = productRepository.findByCode(p);
                if (productModel.isPresent()) {
                    products.add(productModel.get());
                }
            });
            category.setProducts(products);
        }

        if (categoryData.getProductCodes() != null) {
            Set<Long> allProductCodes = categoryData.getProductCodes();
            Set<Long> existingCodes = category.getProducts().stream().map(ProductModel::getCode).collect(Collectors.toSet());
            Set<Long> toAdd = allProductCodes.stream().filter(codeVal -> !existingCodes.contains(codeVal)).collect(Collectors.toSet());
            Set<Long> toRemove = existingCodes.stream().filter(codeVal -> !allProductCodes.contains(codeVal)).collect(Collectors.toSet());

            if (!toAdd.isEmpty()) {
                Set<ProductModel> products = new HashSet<>();
                toAdd.forEach(p -> {
                    Optional<ProductModel> productModel = productRepository.findByCode(p);
                    if (productModel.isPresent()) {
                        products.add(productModel.get());
                    }
                });
                category.getProducts().addAll(products);
            }

            if (!toRemove.isEmpty()) {
                category.getProducts().removeIf(p -> toRemove.contains(p.getCode()));
            }
        }

        categoryRepository.save(category);
        return categoryMapper.toData(category);
    }

    @Override
    public void deleteCategory(Long code) {
        if (!categoryRepository.existsByCode(code)) {
            throw new RuntimeException("Category not found with code: " + code);
        }
        categoryRepository.deleteByCode(code);
    }
}
