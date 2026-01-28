package com.shop.product_service.category.model;

import com.shop.product_service.product.model.ProductModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "p_category")
@Getter
@Setter
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

    @ManyToMany
    @JoinTable(
        name = "category_parents",
        joinColumns = @JoinColumn(name = "category_id"),
        inverseJoinColumns = @JoinColumn(name = "parent_category_id")
    )
    private Set<CategoryModel> parentCategories = new HashSet<>();

    @ManyToMany(mappedBy = "parentCategories")
    private Set<CategoryModel> children = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type = CategoryType.CATEGORY;

    @ManyToMany(mappedBy = "categories")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Set<ProductModel> products = new HashSet<>();

}
