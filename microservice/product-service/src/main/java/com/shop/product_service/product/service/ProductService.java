package com.shop.product_service.product.service;

import com.shop.product_service.product.dto.ProductData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {
    List<ProductData> getAllProducts();
    ProductData getProductByCode(Long code);
    ProductData createProduct(ProductData productDto) ;
    ProductData updateProduct(Long code, ProductData productDto);
    void deleteProduct(Long code);
}
