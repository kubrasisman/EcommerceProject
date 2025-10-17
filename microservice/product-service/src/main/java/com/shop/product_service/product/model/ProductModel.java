package com.shop.product_service.product.model;

import com.shop.product_service.category.model.CategoryModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "p_product")
@Getter
@Setter
public class ProductModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private Long code;
    private String title;
    private String description;
    private String name;
    private String brand;
    private double price;
    private String imageUrl;

    @ManyToMany(cascade = { CascadeType.ALL, CascadeType.PERSIST })
    @JoinTable(
            name = "product_categories",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Set<CategoryModel> categories = new HashSet<>();

}
