package com.shop.product_service.product.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductPageableResponse {
    private Integer currentPage;
    private Integer totalPage;
    private List<ProductDtoResponse> products;
}
