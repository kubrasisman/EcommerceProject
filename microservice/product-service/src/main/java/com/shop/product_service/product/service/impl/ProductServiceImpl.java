package com.shop.product_service.product.service.impl;

import com.shop.product_service.category.model.CategoryModel;
import com.shop.product_service.category.repository.CategoryRepository;
import com.shop.product_service.product.dto.ProductData;
import com.shop.product_service.product.model.ProductModel;
import com.shop.product_service.product.populator.ProductPopulator;
import com.shop.product_service.product.repository.ProductRepository;
import com.shop.product_service.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.CollectionUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductPopulator productMapper;


    @Override
    public List<ProductData> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toData)
                .collect(Collectors.toList());
    }

    @Override
    public ProductData getProductByCode(Long code) {
        ProductModel product = productRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Product not found with code: " + code));
        return productMapper.toData(product);
    }

    @Override
    public ProductData createProduct(ProductData productDto) {
        ProductModel product = productMapper.toModel(productDto);

        if (!CollectionUtils.isEmpty(productDto.getCategoryCodes())) {
            if (productDto.getCategoryCodes() != null && !productDto.getCategoryCodes().isEmpty()) {
                Set<CategoryModel> categories = new HashSet<>();
                productDto.getCategoryCodes().forEach(c -> {
                    Optional<CategoryModel> categoryModel = categoryRepository.findByCode(c);
                    if (categoryModel.isPresent()) {
                        categories.add(categoryModel.get());
                    }
                });
                product.setCategories(categories);
            }
        }
        productRepository.save(product);
        return productMapper.toData(product);
    }

    @Override
    public ProductData updateProduct(Long code, ProductData productDto) {
        ProductModel product = productRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Product not found with code: " + code));

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setBrand(productDto.getBrand());
        product.setTitle(productDto.getTitle());
        product.setImageUrl(productDto.getImageUrl());

        if (productDto.getCategoryCodes() != null) {
            Set<Long> allCategories = productDto.getCategoryCodes();
            Set<Long> existingCodes = product.getCategories().stream().map(CategoryModel::getCode).collect(Collectors.toSet());
            Set<Long> toAdd = allCategories.stream().filter(c -> !existingCodes.contains(c)).collect(Collectors.toSet());
            Set<Long> toRemove = existingCodes.stream().filter(c -> !allCategories.contains(c)).collect(Collectors.toSet());

            if (!toAdd.isEmpty()) {
                Set<CategoryModel> categories = new HashSet<>();
                toAdd.forEach(c -> {
                    Optional<CategoryModel> categoryModel = categoryRepository.findByCode(c);
                    if (categoryModel.isPresent()) {
                        categories.add(categoryModel.get());
                    }
                });
                product.getCategories().addAll(categories);
            }
            if (!toRemove.isEmpty()) {
                product.getCategories().removeIf(c -> toRemove.contains(c.getCode()));
            }
        }

        productRepository.save(product);
        return productMapper.toData(product);
    }

    @Override
    public void deleteProduct(Long code) {
        if (!productRepository.existsByCode(code)) {
            throw new RuntimeException("Product not found with code: " + code);
        }
        productRepository.deleteByCode(code);
    }
}
