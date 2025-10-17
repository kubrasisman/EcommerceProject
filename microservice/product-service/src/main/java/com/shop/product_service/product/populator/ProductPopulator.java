package com.shop.product_service.product.populator;

import com.shop.product_service.category.model.CategoryModel;
import com.shop.product_service.category.populator.CategoryPopulator;
import com.shop.product_service.product.dto.ProductDto;
import com.shop.product_service.product.dto.response.ProductDtoResponse;
import com.shop.product_service.product.model.ProductModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;


@Mapper(componentModel = "spring", uses = CategoryPopulator.class)
public interface ProductPopulator {

    @Mapping(target = "categoryCodes", expression = "java(mapCategoriesToCodes(product.getCategories()))")
    ProductDto toData(ProductModel product);

    ProductModel toModel(ProductDto data);

    @Mapping(target = "categoryCodes", source = "categories")
    ProductDtoResponse toDtoResponse(ProductModel product);

    default Set<Long> mapCategoriesToCodes(Set<CategoryModel> categories) {
        if (categories == null) return null;
        return categories.stream()
                .map(CategoryModel::getCode)
                .collect(Collectors.toSet());
    }

}
