package com.shop.product_service.category.service.impl;

import com.shop.product_service.category.dto.CategoryDto;
import com.shop.product_service.category.dto.response.CategoryDtoResponse;
import com.shop.product_service.category.model.CategoryModel;
import com.shop.product_service.category.populator.CategoryPopulator;
import com.shop.product_service.category.repository.CategoryRepository;
import com.shop.product_service.category.service.CategoryService;
import com.shop.product_service.common.logging.MdcContextUtil;
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
    private static final Long BRANDS_PARENT_CODE = 2L;

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
            MdcContextUtil.setCategoryContext(String.valueOf(categoryDto.getCode()));
            Long code = categoryDto.getCode();
            if (code != null && categoryRepository.existsByCode(code)) {
                log.warn("CATEGORY: Category with code {} already exists", code);
                return categoryMapper.toDtoResponse(categoryRepository.findByCode(code).get());
            }

            CategoryModel categoryModel = categoryMapper.toModel(categoryDto);

            // Set type from DTO
            if (categoryDto.getType() != null) {
                categoryModel.setType(categoryDto.getType());
            }

            // Handle multiple parent categories
            Set<Long> parentCategoryCodes = categoryDto.getParentCategoryCodes();
            if (!CollectionUtils.isEmpty(parentCategoryCodes)) {
                Set<CategoryModel> parentCategories = new HashSet<>();

                for (Long parentCode : parentCategoryCodes) {
                    CategoryModel parentCategory = categoryRepository.findByCode(parentCode)
                            .orElseThrow(() -> {
                                log.warn("CATEGORY: Parent category not found with code: {}", parentCode);
                                return new RuntimeException("Parent category not found with code: " + parentCode);
                            });
                    parentCategories.add(parentCategory);
                }

                categoryModel.setParentCategories(parentCategories);
                log.info("CATEGORY: Setting {} parent categories", parentCategories.size());
            } else {
                categoryModel.setParentCategories(new HashSet<>());
                log.info("CATEGORY: Creating independent category");
            }

            // Handle products
            Set<Long> productCodes = categoryDto.getProductCodes();
            if (!CollectionUtils.isEmpty(productCodes)) {
                Set<ProductModel> products = new HashSet<>();
                productCodes.forEach(p -> {
                    try {
                        Optional<ProductModel> productModel = productRepository.findByCode(p);
                        productModel.ifPresent(products::add);
                    } catch (Exception ex) {
                        log.warn("CATEGORY: Failed to load product with code {}. Skipping. Error: {}", p, ex);
                    }
                });
                categoryModel.setProducts(products.isEmpty() ? Collections.emptySet() : products);
            } else {
                categoryModel.setProducts(Collections.emptySet());
            }

            categoryRepository.save(categoryModel);
            log.info("CATEGORY: Category created successfully - code: {}, type: {}",
                    categoryModel.getCode(), categoryModel.getType());
            return categoryMapper.toDtoResponse(categoryModel);
        } catch (Exception ex) {
            log.error("CATEGORY: Failed to create category", ex);
            throw new RuntimeException("Failed to create category", ex);
        } finally {
            MdcContextUtil.clearBusinessContext();
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
            MdcContextUtil.setCategoryContext(String.valueOf(code));
            CategoryModel category = categoryRepository.findByCode(code)
                    .orElseThrow(() -> {
                        log.warn("CATEGORY: Category not found with code: {}", code);
                        return new RuntimeException("Category not found with code: " + code);
                    });

            category.setName(categoryDto.getName());
            category.setDescription(categoryDto.getDescription());
            category.setCode(categoryDto.getCode());

            // Update type
            if (categoryDto.getType() != null) {
                category.setType(categoryDto.getType());
            }

            // Handle multiple parent categories change
            Set<Long> newParentCodes = categoryDto.getParentCategoryCodes();
            Set<Long> currentParentCodes = category.getParentCategories().stream()
                    .map(CategoryModel::getCode)
                    .collect(Collectors.toSet());

            // Check if parent categories changed
            boolean parentsChanged = !Objects.equals(newParentCodes, currentParentCodes);
            if (parentsChanged) {
                if (!CollectionUtils.isEmpty(newParentCodes)) {
                    Set<CategoryModel> newParentCategories = new HashSet<>();

                    for (Long parentCode : newParentCodes) {
                        CategoryModel newParent = categoryRepository.findByCode(parentCode)
                                .orElseThrow(() -> {
                                    log.warn("CATEGORY: Parent category not found with code: {}", parentCode);
                                    return new RuntimeException("Parent category not found with code: " + parentCode);
                                });

                        // Prevent circular reference
                        if (isDescendant(newParent, category)) {
                            log.warn("CATEGORY: Cannot set parent {} - circular reference detected", parentCode);
                            throw new IllegalArgumentException("Cannot set parent " + parentCode + ": circular reference detected");
                        }

                        newParentCategories.add(newParent);
                    }

                    category.setParentCategories(newParentCategories);
                    log.info("CATEGORY: Parents changed to {} categories", newParentCategories.size());
                } else {
                    category.setParentCategories(new HashSet<>());
                    log.info("CATEGORY: All parents removed, now independent category");
                }
            }

            // Handle product updates
            if (categoryDto.getProductCodes() != null) {
                Set<Long> allProductCodes = categoryDto.getProductCodes();
                Set<Long> existingCodes = category.getProducts().stream().map(ProductModel::getCode).collect(Collectors.toSet());
                Set<Long> toAdd = allProductCodes.stream().filter(codeVal -> !existingCodes.contains(codeVal)).collect(Collectors.toSet());
                Set<Long> toRemove = existingCodes.stream().filter(codeVal -> !allProductCodes.contains(codeVal)).collect(Collectors.toSet());

                if (!toAdd.isEmpty()) {
                    toAdd.forEach(p -> {
                        try {
                            Optional<ProductModel> productModel = productRepository.findByCode(p);
                            productModel.ifPresent(pm -> {
                                pm.getCategories().add(category);
                                category.getProducts().add(pm);
                                productRepository.save(pm);
                            });
                        } catch (Exception ex) {
                            log.warn("CATEGORY: Failed to load product with code {} while updating. Skipping. Error: {}", p, ex);
                        }
                    });
                }

                if (!toRemove.isEmpty()) {
                    category.getProducts().removeIf(p -> toRemove.contains(p.getCode()));
                }
            }

            categoryRepository.save(category);
            log.info("CATEGORY: Category updated successfully - code: {}, type: {}", code, category.getType());
            return categoryMapper.toDtoResponse(category);
        } catch (Exception ex) {
            log.error("CATEGORY: Failed to update category with code {}", code, ex);
            throw new RuntimeException("Failed to update category", ex);
        } finally {
            MdcContextUtil.clearBusinessContext();
        }
    }

    /**
     * Check if potentialDescendant is a descendant of potentialAncestor
     */
    private boolean isDescendant(CategoryModel potentialDescendant, CategoryModel potentialAncestor) {
        if (potentialDescendant == null || potentialAncestor == null) {
            return false;
        }
        if (potentialDescendant.getId().equals(potentialAncestor.getId())) {
            return true;
        }
        Set<CategoryModel> children = potentialAncestor.getChildren();
        if (CollectionUtils.isEmpty(children)) {
            return false;
        }
        for (CategoryModel child : children) {
            if (child.getId().equals(potentialDescendant.getId()) || isDescendant(potentialDescendant, child)) {
                return true;
            }
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteCategory(Long code) {
        if (code == null) {
            log.warn("deleteCategory called with null code");
            throw new IllegalArgumentException("Category code must not be null");
        }
        try {
            MdcContextUtil.setCategoryContext(String.valueOf(code));
            if (!categoryRepository.existsByCode(code)) {
                log.info("CATEGORY: Attempted to delete non-existing category with code {}", code);
                return false;
            }
            categoryRepository.deleteByCode(code);
            log.info("CATEGORY: Category deleted successfully - code: {}", code);
            return true;
        } catch (Exception ex) {
            log.error("CATEGORY: Failed to delete category with code {}", code, ex);
            throw new RuntimeException("Failed to delete category", ex);
        } finally {
            MdcContextUtil.clearBusinessContext();
        }
    }

    // ==================== Hierarchy Methods ====================
    @Override
    public List<CategoryDtoResponse> getCategoryHierarchy() {
        try {
            log.info("CATEGORY: Building full category hierarchy");
            List<CategoryModel> independentCategories = categoryRepository.findByParentCategoriesIsEmpty();
            if (CollectionUtils.isEmpty(independentCategories)) {
                log.info("CATEGORY: No independent categories found for hierarchy");
                return Collections.emptyList();
            }

            List<CategoryDtoResponse> hierarchy = independentCategories.stream()
                    .map(this::buildCategoryTree)
                    .collect(Collectors.toList());
            log.info("CATEGORY: Category hierarchy built with {} independent categories", hierarchy.size());
            return hierarchy;
        } catch (Exception ex) {
            log.error("CATEGORY: Failed to build category hierarchy", ex);
            throw new RuntimeException("Failed to build category hierarchy", ex);
        }
    }

    /**
     * Recursively build category tree with children
     */
    private CategoryDtoResponse buildCategoryTree(CategoryModel category) {
        CategoryDtoResponse dto = categoryMapper.toDtoResponse(category);

        Set<CategoryModel> children = category.getChildren();
        if (!CollectionUtils.isEmpty(children)) {
            List<CategoryDtoResponse> childDtos = children.stream()
                    .map(this::buildCategoryTree)
                    .collect(Collectors.toList());
            dto.setChildren(childDtos);
        } else {
            dto.setChildren(Collections.emptyList());
        }

        return dto;
    }

    @Override
    public List<Long> getAllDescendantCodes(Long categoryCode) {
        if (categoryCode == null) {
            return Collections.emptyList();
        }
        try {
            log.info("CATEGORY: Getting all descendant codes for category: {}", categoryCode);
            CategoryModel category = categoryRepository.findByCode(categoryCode).orElse(null);
            if (category == null) {
                log.warn("CATEGORY: Category not found with code: {}", categoryCode);
                return Collections.singletonList(categoryCode);
            }

            List<Long> codes = new ArrayList<>();
            codes.add(categoryCode);
            collectDescendantCodes(category, codes);

            log.info("CATEGORY: Found {} total category codes (including descendants) for category: {}",
                    codes.size(), categoryCode);
            return codes;
        } catch (Exception ex) {
            log.error("CATEGORY: Failed to get descendant codes for category: {}", categoryCode, ex);
            return Collections.singletonList(categoryCode);
        }
    }

    /**
     * Recursively collect all descendant category codes
     */
    private void collectDescendantCodes(CategoryModel category, List<Long> codes) {
        Set<CategoryModel> children = category.getChildren();
        if (CollectionUtils.isEmpty(children)) {
            return;
        }
        for (CategoryModel child : children) {
            codes.add(child.getCode());
            collectDescendantCodes(child, codes);
        }
    }

    // ==================== Brand Methods ====================
    @Override
    public List<CategoryDtoResponse> getBrands() {
        try {
            log.info("CATEGORY: Fetching brands (children of code={})", BRANDS_PARENT_CODE);
            Optional<CategoryModel> brandsParent = categoryRepository.findByCode(BRANDS_PARENT_CODE);

            if (brandsParent.isEmpty()) {
                log.warn("CATEGORY: Brands parent category (code={}) not found", BRANDS_PARENT_CODE);
                return Collections.emptyList();
            }

            List<CategoryModel> brands = categoryRepository.findByParentCategoriesContaining(brandsParent.get());

            if (CollectionUtils.isEmpty(brands)) {
                log.info("CATEGORY: No brands found under code={}", BRANDS_PARENT_CODE);
                return Collections.emptyList();
            }

            List<CategoryDtoResponse> result = brands.stream()
                    .map(categoryMapper::toDtoResponse)
                    .collect(Collectors.toList());

            log.info("CATEGORY: Found {} brands", result.size());
            return result;
        } catch (Exception ex) {
            log.error("CATEGORY: Failed to fetch brands", ex);
            throw new RuntimeException("Failed to fetch brands", ex);
        }
    }
}
