package com.shop.order_service.cart.dto.request;

import lombok.Data;

@Data
public class CartEntryDto {
    private String cart;
    private String product;
    private Integer quantity;
    private String code;
}
