package com.shop.search_service.product.service;

import com.shop.search_service.product.dto.response.ProductSearchResponse;
import com.shop.search_service.product.model.ProductDocument;

public interface ProductIndexService {
    String indexProduct(ProductDocument product);
    String indexAll();
    ProductSearchResponse search(String keyword, Long categoryCode, int page, int size);

}
