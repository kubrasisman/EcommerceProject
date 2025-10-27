package com.shop.order_service.order.dto.response;

import com.shop.order_service.cart.dto.response.AddressDtoResponse;
import com.shop.order_service.cart.dto.response.CustomerDtoResponse;
import com.shop.order_service.order.type.OrderStatus;
import com.shop.order_service.payment.dto.PaymentTransactionData;
import com.shop.order_service.payment.dto.response.PaymentTransactionDtoResponse;
import com.shop.order_service.payment.type.PaymentMethod;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDtoResponse {
    private String code;
    private double totalPrice;
    private CustomerDtoResponse owner;
    private LocalDateTime creationDate;
    private AddressDtoResponse address;
    private List<PaymentTransactionDtoResponse> payments;
    private PaymentMethod paymentMethod;
    private List<OrderEntryDtoResponse> entries;
    private OrderStatus status;
}
