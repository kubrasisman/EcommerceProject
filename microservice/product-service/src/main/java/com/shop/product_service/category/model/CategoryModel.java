package com.shop.product_service.category.model;

import com.shop.product_service.product.model.ProductModel;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "p_category")
@Data
public class CategoryModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private Long code;
    private String name;
    private String description;

    @ManyToMany(mappedBy = "categories")
    private Set<ProductModel> products = new HashSet<>();

}
