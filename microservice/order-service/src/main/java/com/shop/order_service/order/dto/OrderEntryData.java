package com.shop.order_service.order.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class OrderEntryData {
    private Long id;
    private Long productCode;
    private Integer quantity;
    private double basePrice;
    private double totalPrice;
    private Integer entryNumber;
    private Integer canceledAmount;
    private Integer shippedAmount;
    private LocalDateTime creationDate;
}
