package com.shop.order_service.order.dto;

import com.shop.order_service.order.type.OrderStatus;
import com.shop.order_service.payment.dto.PaymentTransactionData;
import com.shop.order_service.payment.type.PaymentMethod;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderData {
    private String code;
    private double totalPrice;
    private String owner;
    private LocalDateTime creationDate;
    private Long address;
    private List<PaymentTransactionData> payments;
    private PaymentMethod paymentMethod;
    private List<OrderEntryData> entries;
    private OrderStatus status;
}
