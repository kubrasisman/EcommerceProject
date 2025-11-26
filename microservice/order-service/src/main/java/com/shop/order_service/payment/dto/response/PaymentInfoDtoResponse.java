package com.shop.order_service.payment.dto.response;

import com.shop.order_service.payment.dto.PaymentTransactionData;
import com.shop.order_service.payment.model.PaymentTransactionModel;
import lombok.Data;

@Data
public class PaymentInfoDtoResponse {
    private String bankName;
}
