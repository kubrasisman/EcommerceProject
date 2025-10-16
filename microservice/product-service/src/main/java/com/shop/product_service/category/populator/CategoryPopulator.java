package com.shop.product_service.category.populator;

import com.shop.product_service.category.dto.CategoryDto;
import com.shop.product_service.category.dto.response.CategoryDtoResponse;
import com.shop.product_service.category.model.CategoryModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryPopulator {
    @Mapping(target = "productCodes", expression = "java(category.getProducts() != null ? category.getProducts().stream().map(p -> p.getCode()).collect(java.util.stream.Collectors.toSet()) : null)")
    CategoryDto toData(CategoryModel category);

    @Mapping(target = "products", ignore = true)
    CategoryModel toModel(CategoryDto categoryDto);

    @Mapping(target = "productCodes", expression = "java(category.getProducts() != null ? category.getProducts().stream().map(p -> p.getCode()).collect(java.util.stream.Collectors.toSet()) : null)")
    CategoryDtoResponse toDtoResponse(CategoryModel category);

    CategoryDtoResponse toDtoResponse(CategoryDto categoryDto);
}
