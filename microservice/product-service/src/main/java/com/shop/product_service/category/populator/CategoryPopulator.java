package com.shop.product_service.category.populator;

import com.shop.product_service.category.dto.CategoryDto;
import com.shop.product_service.category.dto.response.CategoryDtoResponse;
import com.shop.product_service.category.model.CategoryModel;
import com.shop.product_service.product.model.ProductModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CategoryPopulator {

    @Mapping(target = "productCodes", expression = "java(mapProductsToCodes(category.getProducts()))")
    @Mapping(target = "parentCategoryCodes", expression = "java(mapParentCategoryCodes(category))")
    CategoryDto toData(CategoryModel category);

    @Mapping(target = "parentCategories", ignore = true)
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "products", ignore = true)
    CategoryModel toModel(CategoryDto categoryDto);

    @Mapping(target = "productCodes", expression = "java(mapProductsToCodes(category.getProducts()))")
    @Mapping(target = "parentCategoryCodes", expression = "java(mapParentCategoryCodes(category))")
    @Mapping(target = "children", ignore = true)
    CategoryDtoResponse toDtoResponse(CategoryModel category);

    CategoryDtoResponse toDtoResponse(CategoryDto categoryDto);

    default Set<Long> mapProductsToCodes(Set<ProductModel> products) {
        if (products == null) return null;
        return products.stream()
                .map(ProductModel::getCode)
                .collect(Collectors.toSet());
    }

    default Set<Long> mapParentCategoryCodes(CategoryModel category) {
        if (category == null || category.getParentCategories() == null || category.getParentCategories().isEmpty()) {
            return null;
        }
        return category.getParentCategories().stream()
                .map(CategoryModel::getCode)
                .collect(Collectors.toSet());
    }
}
