package com.shop.product_service.product.service.impl;

import com.shop.product_service.category.model.CategoryModel;
import com.shop.product_service.category.repository.CategoryRepository;
import com.shop.product_service.product.dto.ProductDto;
import com.shop.product_service.product.dto.response.ProductDtoResponse;
import com.shop.product_service.product.model.ProductModel;
import com.shop.product_service.product.populator.ProductPopulator;
import com.shop.product_service.product.repository.ProductRepository;
import com.shop.product_service.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductPopulator productMapper;


    @Override
    public List<ProductDtoResponse> getAllProducts() {
        try {
            List<ProductModel> products = productRepository.findAll();
            if (CollectionUtils.isEmpty(products)) {
                return Collections.emptyList();
            }
            return products.stream()
                    .map(productMapper::toDtoResponse)
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            log.error("Failed to fetch all products", ex);
            throw new RuntimeException("Could not fetch products", ex);
        }
    }

    @Override
    public ProductDtoResponse getProductByCode(Long code) {
        try {
            ProductModel product = productRepository.findByCode(code)
                    .orElseThrow(() -> {
                        log.warn("Product not found with code: {}", code);
                        return new RuntimeException("Product not found with code: " + code);
                    });
            return productMapper.toDtoResponse(product);
        } catch (Exception ex) {
            log.error("Error while getting product by code: {}", code, ex);
            throw new RuntimeException("Error while getting product", ex);
        }
    }

    @Override
    @Transactional
    public ProductDtoResponse createProduct(ProductDto productDto) {
        if (productDto == null) {
            log.warn("createProduct called with null productDto");
            throw new IllegalArgumentException("Product data must not be null");
        }
        try {
            if (productDto.getCode() != null && productRepository.existsByCode(productDto.getCode())) {
                log.warn("Product with code {} already exists", productDto.getCode());
                return productMapper.toDtoResponse(productRepository.findByCode(productDto.getCode()).get());
            }

            ProductModel product = productMapper.toModel(productDto);
            // handle categories
            Set<Long> categoryCodes = productDto.getCategoryCodes();
            if (!CollectionUtils.isEmpty(categoryCodes)) {
                Set<CategoryModel> categories = new HashSet<>();
                categoryCodes.forEach(c -> {
                    try {
                        Optional<CategoryModel> categoryModel = categoryRepository.findByCode(c);
                        categoryModel.ifPresent(categories::add);
                    } catch (Exception ex) {
                        log.warn("Failed to load category with code {}. Skipping. Error: {}", c, ex.getMessage());
                    }
                });
                if (!categories.isEmpty()) {
                    product.setCategories(categories);
                } else {
                    product.setCategories(Collections.emptySet());
                }
            } else {
                product.setCategories(Collections.emptySet());
            }

            ProductModel saved = productRepository.save(product);
            return productMapper.toDtoResponse(saved);
        } catch (Exception ex) {
            log.error("Failed to create product", ex);
            throw new RuntimeException("Failed to create product", ex);
        }
    }

    @Override
    @Transactional
    public ProductDtoResponse updateProduct(ProductDto productDto) {
        if (productDto == null || productDto.getCode() == null) {
            log.warn("updateProduct called with null productDto or null code");
            throw new IllegalArgumentException("Product data and code must not be null");
        }
        try {
            ProductModel product = productRepository.findByCode(productDto.getCode())
                    .orElseThrow(() -> {
                        log.warn("Product not found with code: {}", productDto.getCode());
                        return new RuntimeException("Product not found with code: " + productDto.getCode());
                    });

            product.setName(productDto.getName());
            product.setDescription(productDto.getDescription());
            product.setPrice(productDto.getPrice());
            product.setBrand(productDto.getBrand());
            product.setTitle(productDto.getTitle());
            product.setImageUrl(productDto.getImageUrl());

            // handle category updates
            if (productDto.getCategoryCodes() != null) {
                Set<Long> allCategories = productDto.getCategoryCodes();
                Set<Long> existingCodes = product.getCategories().stream()
                        .map(CategoryModel::getCode)
                        .collect(Collectors.toSet());

                Set<Long> toAdd = allCategories.stream()
                        .filter(c -> c != null && !existingCodes.contains(c))
                        .collect(Collectors.toSet());

                Set<Long> toRemove = existingCodes.stream()
                        .filter(c -> !allCategories.contains(c))
                        .collect(Collectors.toSet());

                if (!toAdd.isEmpty()) {
                    Set<CategoryModel> categoriesToAdd = new HashSet<>();
                    toAdd.forEach(c -> {
                        try {
                            Optional<CategoryModel> categoryModel = categoryRepository.findByCode(c);
                            categoryModel.ifPresent(categoriesToAdd::add);
                        } catch (Exception ex) {
                            log.warn("Failed to load category with code {} while updating. Skipping. Error: {}", c, ex.getMessage());
                        }
                    });
                    product.getCategories().addAll(categoriesToAdd);
                }

                if (!toRemove.isEmpty()) {
                    product.getCategories().removeIf(c -> toRemove.contains(c.getCode()));
                }
            }

            ProductModel saved = productRepository.save(product);
            return productMapper.toDtoResponse(saved);
        }catch (Exception ex) {
            log.error("Failed to update product with code {}", productDto.getCode(), ex);
            throw new RuntimeException("Failed to update product", ex);
        }
    }

    @Override
    @Transactional
    public boolean deleteProduct(Long code) {
        if (code == null) {
            log.warn("deleteProduct called with null code");
            throw new IllegalArgumentException("Product code must not be null");
        }
        try {
            if (!productRepository.existsByCode(code)) {
                log.info("Attempted to delete non-existing product with code {}", code);
                return false;
            }
            productRepository.deleteByCode(code);
            return true;
        } catch (Exception ex) {
            log.error("Failed to delete product with code {}", code, ex);
            throw new RuntimeException("Failed to delete product", ex);
        }
    }
}
