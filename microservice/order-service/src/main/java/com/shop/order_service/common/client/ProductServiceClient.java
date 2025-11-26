package com.shop.order_service.common.client;

import com.shop.order_service.common.dto.response.ProductDtoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "product-service", path = "/api/products")
public interface ProductServiceClient {
    @GetMapping(value = "/{code}")
    ProductDtoResponse getProduct(@PathVariable("code") String code);
}
