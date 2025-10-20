package com.shop.product_service.product.controller;

import com.shop.product_service.product.dto.ProductDto;
import com.shop.product_service.product.dto.response.ProductDtoResponse;
import com.shop.product_service.product.dto.response.ProductPageableResponse;
import com.shop.product_service.product.model.ProductModel;
import com.shop.product_service.product.populator.ProductPopulator;
import com.shop.product_service.product.repository.ProductRepository;
import com.shop.product_service.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/products")
@RequiredArgsConstructor
public class ProductController extends AbstractController{

    private final ProductService productService;

    @GetMapping(value = "/{id}")
    public ProductDtoResponse getProduct(@PathVariable("id") Long code) {
        return productService.getProductByCode(code);
    }

    @GetMapping
    public ProductPageableResponse getProducts(
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
            @RequestParam(value = "order", required = false, defaultValue = "ASC") String order,
            @RequestParam(value = "sort", required = false, defaultValue = "id") String sort) {
        return productService.getPageableProducts(generatePageable(page, limit, order, sort));
    }

    @PostMapping(value = "/save")
    public ProductDtoResponse saveProduct(@RequestBody ProductDto productDTO) {
        return productService.createProduct(productDTO);
    }

    @PostMapping(value = "/update")
    public ProductDtoResponse updateProduct(@RequestBody ProductDto productDTO) {
        return productService.updateProduct(productDTO);
    }

    @DeleteMapping(value = "remove/{id}")
    public boolean deleteProduct(@PathVariable Long id){
        return productService.deleteProduct(id);
    }
}
