package com.shop.order_service.common.dto.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class ProductDtoResponse implements Serializable {
    private Long id;
    private Long code;
    private String name;
    private String title;
    private String description;
    private String brand;
    private double price;
    private String imageUrl;

}
