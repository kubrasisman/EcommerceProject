package com.shop.order_service.cart.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CartEntryData {
    private Long id;
    private Long productCode;
    private Integer quantity;
    private double basePrice;
    private double totalPrice;
    private Integer entryNumber;
    private Date creationDate;
}
