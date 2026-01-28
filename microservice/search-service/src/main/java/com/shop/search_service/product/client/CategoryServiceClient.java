package com.shop.search_service.product.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(value = "product-service", contextId = "categoryServiceClient", path = "/api/categories")
public interface CategoryServiceClient {

    @GetMapping("/{code}/descendant-codes")
    List<Long> getDescendantCodes(@PathVariable("code") Long code);
}
