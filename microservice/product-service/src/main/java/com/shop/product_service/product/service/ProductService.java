package com.shop.product_service.product.service;

import com.shop.product_service.product.dto.ProductDto;
import com.shop.product_service.product.dto.response.ProductDtoResponse;
import com.shop.product_service.product.dto.response.ProductPageableResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    List<ProductDtoResponse> getAllProducts();
    ProductDtoResponse getProductByCode(Long code);
    ProductDtoResponse createProduct(ProductDto productDto) ;
    ProductDtoResponse updateProduct(ProductDto productDto);
    boolean deleteProduct(Long code);
    ProductPageableResponse getPageableProducts(Pageable pageable);
}
