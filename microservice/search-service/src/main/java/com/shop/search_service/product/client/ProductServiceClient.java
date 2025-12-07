package com.shop.search_service.product.client;

import com.shop.search_service.product.client.response.ProductPageableResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(value = "product-service", path = "/api/products")
public interface ProductServiceClient {
    @GetMapping
    ProductPageableResponse getProducts(@RequestParam(value = "page") Integer page,
                                        @RequestParam(value = "limit") Integer limit,
                                        @RequestParam(value = "order") String order,
                                        @RequestParam(value = "sort") String sort);
}
