package com.shop.product_service.category.repository;

import com.shop.product_service.category.model.CategoryModel;
import com.shop.product_service.category.model.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryModel, Long> {
    Optional<CategoryModel> findByCode(Long code);
    boolean existsByCode(Long code);
    void deleteByCode(Long code);

    // Hierarchy methods - for ManyToMany parent relationship
    @Query("SELECT c FROM CategoryModel c WHERE c.parentCategories IS EMPTY")
    List<CategoryModel> findByParentCategoriesIsEmpty();  // independent (root) categories

    @Query("SELECT c FROM CategoryModel c JOIN c.parentCategories p WHERE p = :parent")
    List<CategoryModel> findByParentCategoriesContaining(@Param("parent") CategoryModel parent);
}
