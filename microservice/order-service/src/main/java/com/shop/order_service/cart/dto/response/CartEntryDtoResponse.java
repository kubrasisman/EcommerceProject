package com.shop.order_service.cart.dto.response;

import com.shop.order_service.common.dto.response.ProductDtoResponse;
import lombok.Data;

import java.io.Serializable;

@Data
public class CartEntryDtoResponse implements Serializable {
    private ProductDtoResponse product;
    private CustomerDtoResponse owner;
    private Integer quantity;
    private String code;
    private double basePrice;
    private double totalPrice;
}
