package com.shop.product_service.product.controller;

import com.shop.product_service.product.dto.ProductDto;
import com.shop.product_service.product.dto.response.ProductDtoResponse;
import com.shop.product_service.product.dto.response.ProductPageableResponse;
import com.shop.product_service.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController extends AbstractController{

    private final ProductService productService;

    @GetMapping(value = "/{id}")
    public ProductDtoResponse getProduct(@PathVariable("id") Long code) {
        log.info("Request received: GET /api/products/{}", code);
        ProductDtoResponse response = productService.getProductByCode(code);
        log.info("Request completed: GET /api/products/{} - Status: 200", code);
        return response;
    }

    @GetMapping
    public ProductPageableResponse getProducts(
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
            @RequestParam(value = "order", required = false, defaultValue = "ASC") String order,
            @RequestParam(value = "sort", required = false, defaultValue = "id") String sort) {
        log.info("Request received: GET /api/products - page: {}, limit: {}, order: {}, sort: {}", page, limit, order, sort);
        ProductPageableResponse response = productService.getPageableProducts(generatePageable(page, limit, order, sort));
        log.info("Request completed: GET /api/products - Status: 200");
        return response;
    }

    @PostMapping(value = "/save")
    public ProductDtoResponse saveProduct(@RequestBody ProductDto productDTO) {
        log.info("Request received: POST /api/products/save - productName: {}", productDTO.getName());
        ProductDtoResponse response = productService.createProduct(productDTO);
        log.info("Request completed: POST /api/products/save - Status: 200, productCode: {}", response.getCode());
        return response;
    }

    @PostMapping(value = "/update")
    public ProductDtoResponse updateProduct(@RequestBody ProductDto productDTO) {
        log.info("Request received: POST /api/products/update - productCode: {}", productDTO.getCode());
        ProductDtoResponse response = productService.updateProduct(productDTO);
        log.info("Request completed: POST /api/products/update - Status: 200, productCode: {}", response.getCode());
        return response;
    }

    @DeleteMapping(value = "remove/{id}")
    public boolean deleteProduct(@PathVariable Long id){
        log.info("Request received: DELETE /api/products/remove/{}", id);
        boolean result = productService.deleteProduct(id);
        log.info("Request completed: DELETE /api/products/remove/{} - Status: 200, success: {}", id, result);
        return result;
    }
}
