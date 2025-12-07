package com.shop.search_service.product.controller;

import com.shop.search_service.product.model.ProductDocument;
import com.shop.search_service.product.service.ProductIndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/search/products")
@RequiredArgsConstructor
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
    public List<ProductDocument> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return productIndexService.search(keyword, page, size);
    }
}
