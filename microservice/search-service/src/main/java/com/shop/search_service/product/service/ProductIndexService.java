package com.shop.search_service.product.service;

import com.shop.search_service.product.model.ProductDocument;

import java.util.List;

public interface ProductIndexService {
    String indexProduct(ProductDocument product);
    String indexAll();
    List<ProductDocument> search(String keyword, int page, int size);

}
