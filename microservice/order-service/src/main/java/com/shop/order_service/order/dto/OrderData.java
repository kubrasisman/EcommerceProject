package com.shop.order_service.order.dto;

import com.shop.order_service.order.type.OrderStatus;
import com.shop.order_service.payment.dto.PaymentTransactionData;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
public class OrderData {

    private Long id;
    private String code;
    private double totalPrice;
    private String customerEmail;
    private LocalDateTime creationDate;
    private Long address;
    private PaymentTransactionData payment;
    private List<OrderEntryData> entries;
    private OrderStatus status;
}
