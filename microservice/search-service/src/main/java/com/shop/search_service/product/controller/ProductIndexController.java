package com.shop.search_service.product.controller;

import com.shop.search_service.product.dto.response.ProductSearchResponse;
import com.shop.search_service.product.model.ProductDocument;
import com.shop.search_service.product.service.ProductIndexService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/search/products")
@RequiredArgsConstructor
@Slf4j
public class ProductIndexController {

    private final ProductIndexService productIndexService;

    @PostMapping("/index")
    public String indexProduct(@RequestBody ProductDocument product) {
        return productIndexService.indexProduct(product);
    }

    @PostMapping("/indexAll")
    public String indexProduct() {
       return productIndexService.indexAll();
    }

    @GetMapping("/search")
    public ProductSearchResponse searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Request received: GET /api/search/products/search - keyword: {}, categoryCode: {}, page: {}, size: {}",
                keyword, categoryCode, page, size);
        return productIndexService.search(keyword, categoryCode, page, size);
    }
}
