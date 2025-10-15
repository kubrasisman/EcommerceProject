package com.shop.product_service.category.repository;

import com.shop.product_service.category.model.CategoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryModel, Long> {
    Optional<CategoryModel> findByCode(Long code);
    boolean existsByCode(Long code);
    void deleteByCode(Long code);
}
