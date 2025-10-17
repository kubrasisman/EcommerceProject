package com.shop.product_service.category.populator;

import com.shop.product_service.category.dto.CategoryDto;
import com.shop.product_service.category.dto.response.CategoryDtoResponse;
import com.shop.product_service.category.model.CategoryModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryPopulator {

    CategoryDto toData(CategoryModel category);

    CategoryModel toModel(CategoryDto categoryDto);

    CategoryDtoResponse toDtoResponse(CategoryModel category);

    CategoryDtoResponse toDtoResponse(CategoryDto categoryDto);
}
