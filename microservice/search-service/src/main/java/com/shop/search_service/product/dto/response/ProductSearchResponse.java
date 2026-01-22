package com.shop.search_service.product.dto.response;

import com.shop.search_service.product.model.ProductDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchResponse {
    private List<ProductDocument> products;
    private Integer currentPage;
    private Integer totalPage;
    private Long totalElements;
}
