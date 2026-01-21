package com.shop.order_service.payment.processor.payment;

import com.shop.order_service.common.logging.MdcContextUtil;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Slf4j
public class BankTransferPaymentProcessor extends PaymentProcessor {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentInfoRepository paymentInfoRepository;


    @Override
    public PaymentTransactionModel createPayment(OrderModel order) {
        MdcContextUtil.setOrderContext(order.getCode());
        log.info("PAYMENT: Creating bank transfer payment for orderCode: {}, amount: {}", order.getCode(), order.getTotalPrice());

        PaymentTransactionModel paymentTransaction = new PaymentTransactionModel();
        paymentTransaction.setAmount(order.getTotalPrice());
        paymentTransaction.setPaymentMethod(PaymentMethod.WIRE_TRANSFER);
        paymentTransaction.setStatus(PaymentStatus.WAITING_FOR_TRANSFER);

        PaymentInfoModel info = new PaymentInfoModel();
        info.setBankName("xxx");
        info.setPaymentTransaction(paymentTransaction);
        paymentTransactionRepository.save(paymentTransaction);

        log.info("PAYMENT: Bank transfer payment created - paymentId: {}, status: {}", paymentTransaction.getId(), paymentTransaction.getStatus());
        return paymentTransaction;
    }

    @Override
    public PaymentTransactionModel updatePaymentTransaction(OrderModel order, PaymentStatus status) {
        MdcContextUtil.setOrderContext(order.getCode());
        log.info("PAYMENT: Updating payment transaction for orderCode: {}, newStatus: {}", order.getCode(), status);

        PaymentTransactionModel paymentTransaction = new PaymentTransactionModel();
        paymentTransaction.setOrder(order);
        paymentTransaction.setAmount(order.getTotalPrice());
        paymentTransaction.setPaymentMethod(PaymentMethod.WIRE_TRANSFER);
        paymentTransaction.setStatus(status);

        paymentTransactionRepository.save(paymentTransaction);
        log.info("PAYMENT: Payment transaction updated - paymentId: {}, status: {}", paymentTransaction.getId(), status);
        return paymentTransaction;
    }

    @Override
    public void confirmPayment(String orderCode) {
        MdcContextUtil.setOrderContext(orderCode);
        log.info("PAYMENT: Confirming payment for orderCode: {}", orderCode);

        PaymentTransactionModel payment = paymentTransactionRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> {
                    log.error("PAYMENT: Payment not found for orderCode: {}", orderCode);
                    return new IllegalStateException("Payment not found");
                });

        payment.setStatus(PaymentStatus.COMPLETED);
        paymentTransactionRepository.save(payment);

        OrderModel order = payment.getOrder();
        order.setStatus(OrderStatus.READY);

        log.info("PAYMENT: Payment confirmed for orderCode: {}, paymentId: {}, orderStatus: {}", orderCode, payment.getId(), order.getStatus());
    }
}
