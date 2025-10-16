package com.shop.product_service.product.populator;

import com.shop.product_service.product.dto.ProductDto;
import com.shop.product_service.product.dto.response.ProductDtoResponse;
import com.shop.product_service.product.model.ProductModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductPopulator {

    @Mapping(target = "categoryCodes", expression = "java(product.getCategories() != null ? product.getCategories().stream().map(c -> c.getCode()).collect(java.util.stream.Collectors.toSet()) : null)")
    ProductDto toData(ProductModel product);

    @Mapping(target = "categories", ignore = true)
    ProductModel toModel(ProductDto data);

    @Mapping(target = "categoryCodes", expression = "java(product.getCategories() != null ? product.getCategories().stream().map(c -> c.getCode()).collect(java.util.stream.Collectors.toSet()) : null)")
    ProductDtoResponse toDtoResponse(ProductModel product);

    ProductDtoResponse toDtoResponse(ProductDto product);
}
