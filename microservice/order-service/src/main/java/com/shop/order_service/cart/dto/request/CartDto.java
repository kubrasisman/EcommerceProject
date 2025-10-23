package com.shop.order_service.cart.dto.request;

import com.shop.order_service.cart.dto.response.CartEntryDtoResponse;
import lombok.Data;

import java.util.List;

@Data
public class CartDto {
    private Long id;
    private String code;
    private String owner;
    private double totalPrice;
    private String customerEmail;
    private Long address;
    private List<CartEntryDtoResponse> entries;
}
