package com.shop.product_service.product.populator;

import com.shop.product_service.category.populator.CategoryPopulator;
import com.shop.product_service.product.dto.ProductDto;
import com.shop.product_service.product.dto.response.ProductDtoResponse;
import com.shop.product_service.product.model.ProductModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = CategoryPopulator.class)
public interface ProductPopulator {


    ProductDto toData(ProductModel product);

    ProductModel toModel(ProductDto data);

    ProductDtoResponse toDtoResponse(ProductModel product);
}
