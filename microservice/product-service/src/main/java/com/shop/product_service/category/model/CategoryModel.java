package com.shop.product_service.category.model;

import com.shop.product_service.product.model.ProductModel;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;

    @ManyToMany(mappedBy = "categories")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Set<ProductModel> products = new HashSet<>();

}
