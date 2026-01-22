package com.shop.search_service.product.client.response;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.shop.search_service.common.CategoryIdDeserializer;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Data
public class ProductDtoResponse implements Serializable {
    private String code;
    private String name;
    private String title;
    private String description;
    private String brand;
    private double price;
    private String imageUrl;
    @JsonDeserialize(using = CategoryIdDeserializer.class)
    private Set<Long> categoryCodes;
}
