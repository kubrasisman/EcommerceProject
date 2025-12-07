package com.shop.search_service.product.client.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class ProductDtoResponse implements Serializable {
    private String code;
    private String name;
    private String description;
    private String brand;
    private double price;
    private String imageUrl;

}
