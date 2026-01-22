package com.shop.search_service.product.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.Set;

@Data
@Document(indexName = "product_index")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDocument {
    private String id;
    private Long code;
    private String title;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private String brand;
    @Field(type = FieldType.Long)
    private Set<Long> categoryCodes;

}
