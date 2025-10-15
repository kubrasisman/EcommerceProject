package com.shop.product_service.category.populator;

import com.shop.product_service.category.dto.CategoryData;
import com.shop.product_service.category.model.CategoryModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryPopulator {
    @Mapping(target = "productCodes", expression = "java(category.getProducts() != null ? category.getProducts().stream().map(p -> p.getCode()).collect(java.util.stream.Collectors.toSet()) : null)")
    CategoryData toData(CategoryModel category);

    @Mapping(target = "products", ignore = true)
    CategoryModel toModel(CategoryData categoryDto);

}
