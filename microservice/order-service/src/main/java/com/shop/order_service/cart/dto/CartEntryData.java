package com.shop.order_service.cart.dto;

import com.shop.order_service.common.dto.response.ProductDtoResponse;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class CartEntryData implements Serializable {
    private Long id;
    private ProductDtoResponse product;
    private Integer quantity;
    private String code;
    private double basePrice;
    private double totalPrice;
}
