package com.shop.order_service.order.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
public class OrderEntryData {
    private String product;
    private Integer quantity;
    private double basePrice;
    private double totalPrice;
    private Integer canceledAmount;
    private Integer shippedAmount;
}
