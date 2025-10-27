package com.shop.order_service.payment.processor;

import com.shop.order_service.order.model.OrderModel;
import com.shop.order_service.payment.model.PaymentTransactionModel;
import com.shop.order_service.payment.type.PaymentStatus;

public abstract class PaymentProcessor {
    public abstract PaymentTransactionModel createPayment(OrderModel order);
    public abstract PaymentTransactionModel updatePaymentTransaction(OrderModel order, PaymentStatus status);

    public abstract void confirmPayment(String orderCode);
}
