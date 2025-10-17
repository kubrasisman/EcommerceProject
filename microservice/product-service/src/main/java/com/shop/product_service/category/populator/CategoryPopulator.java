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
    CategoryDto toData(CategoryModel category);

    CategoryModel toModel(CategoryDto categoryDto);

    @Mapping(target = "productCodes", expression = "java(mapProductsToCodes(category.getProducts()))")
    CategoryDtoResponse toDtoResponse(CategoryModel category);

    CategoryDtoResponse toDtoResponse(CategoryDto categoryDto);

    default Set<Long> mapProductsToCodes(Set<ProductModel> products) {
        if (products == null) return null;
        return products.stream()
                .map(ProductModel::getCode)
                .collect(Collectors.toSet());
    }
}
