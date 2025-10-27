package com.shop.order_service.order.dto.response;

import com.shop.order_service.common.dto.response.ProductDtoResponse;
import lombok.Data;

@Data
public class OrderEntryDtoResponse {
    private ProductDtoResponse product;
    private Integer quantity;
    private double basePrice;
    private double totalPrice;
    private Integer canceledAmount;
    private Integer shippedAmount;
}
