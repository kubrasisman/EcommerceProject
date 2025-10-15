package com.shop.product_service.product.repository;

import com.shop.product_service.product.model.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductModel, Long> {
    Optional<ProductModel> findByCode(Long code);
    boolean existsByCode(Long code);
    void deleteByCode(Long code);
}
