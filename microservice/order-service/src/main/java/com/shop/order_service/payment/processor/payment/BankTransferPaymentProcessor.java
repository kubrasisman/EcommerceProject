package com.shop.order_service.payment.processor.payment;

import com.shop.order_service.order.model.OrderModel;
import com.shop.order_service.order.type.OrderStatus;
import com.shop.order_service.payment.model.PaymentInfoModel;
import com.shop.order_service.payment.model.PaymentTransactionModel;
import com.shop.order_service.payment.processor.PaymentProcessor;
import com.shop.order_service.payment.repository.PaymentInfoRepository;
import com.shop.order_service.payment.repository.PaymentTransactionRepository;
import com.shop.order_service.payment.type.PaymentMethod;
import com.shop.order_service.payment.type.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class BankTransferPaymentProcessor extends PaymentProcessor {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentInfoRepository paymentInfoRepository;


    @Override
    public PaymentTransactionModel createPayment(OrderModel order) {
        PaymentTransactionModel paymentTransaction = new PaymentTransactionModel();
        paymentTransaction.setAmount(order.getTotalPrice());
        paymentTransaction.setPaymentMethod(PaymentMethod.WIRE_TRANSFER);
        paymentTransaction.setStatus(PaymentStatus.WAITING_FOR_TRANSFER);

        PaymentInfoModel info = new PaymentInfoModel();
        info.setBankName("xxx");
        info.setPaymentTransaction(paymentTransaction);
        paymentTransactionRepository.save(paymentTransaction);
        return paymentTransaction;
    }

    @Override
    public PaymentTransactionModel updatePaymentTransaction(OrderModel order, PaymentStatus status) {
        PaymentTransactionModel paymentTransaction = new PaymentTransactionModel();
        paymentTransaction.setOrder(order);
        paymentTransaction.setAmount(order.getTotalPrice());
        paymentTransaction.setPaymentMethod(PaymentMethod.WIRE_TRANSFER);
        paymentTransaction.setStatus(status);

        paymentTransactionRepository.save(paymentTransaction);
        return paymentTransaction;
    }

    @Override
    public void confirmPayment(String orderCode) {
        PaymentTransactionModel payment = paymentTransactionRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new IllegalStateException("Payment not found"));
        payment.setStatus(PaymentStatus.COMPLETED);
        paymentTransactionRepository.save(payment);

        OrderModel order = payment.getOrder();
        order.setStatus(OrderStatus.READY);
    }
}
