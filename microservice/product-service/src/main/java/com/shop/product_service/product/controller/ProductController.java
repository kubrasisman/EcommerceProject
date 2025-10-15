package com.shop.product_service.product.controller;

import com.shop.product_service.product.dto.ProductData;
import com.shop.product_service.product.model.ProductModel;
import com.shop.product_service.product.populator.ProductPopulator;
import com.shop.product_service.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private  final ProductPopulator productPopulator;

    @GetMapping
    public List<ProductModel> getProducts() {
        return (List<ProductModel>) productRepository.findAll();
    }

    @PostMapping
    public boolean saveProduct(@RequestBody ProductData productDTO) {
        ProductModel productModel = productPopulator.toModel(productDTO);
        productRepository.save(productModel);
        return true;
    }

    @DeleteMapping(value = "/{id}")
    public boolean deleteProduct(@PathVariable Long id){
        productRepository.deleteById(id);
        return true;
    }
}
